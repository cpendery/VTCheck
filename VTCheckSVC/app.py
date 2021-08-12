import json
import os
import sys

import requests

import pymysql
import jwt

from creds import key


from flask import (Flask, jsonify, redirect, render_template, request, session,
                   url_for)
from flask_cors import CORS

'''
App Config

'''

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD '] = True
CORS(app)

app.secret_key = os.urandom(24)
# Makes db connection
def db():
    return pymysql.connect(host='mysql',
                             user='root',
                             password='123',
                             database='vtchecksql',
                             port=3306)

# Helper function to make queries to the database, return in neat list format
def query_db(query, one=False):
    cur = db().cursor()
    cur.execute(query)
    r = [dict((cur.description[i][0], value) \
    for i, value in enumerate(row)) for row in cur.fetchall()]
    cur.connection.close()
    return (r[0] if r else None) if one else r

# Home
@app.route("/")
def home():
    return "Hokie Check"

@app.route('/login/', methods=['GET','POST'])
def login():

    username = request.args.get('username', None)
    password = request.args.get('password', None)    
    session.clear()
    
    query = query_db("SELECT * FROM `User` WHERE Username='" + username + "' AND Password='"+ password + "'")
    
    user_id = -1 

    token = ""
    if query:
        permission = "admin" if query[0]['Role_ID'] == 3 else "student"
        token = os.urandom(24)
        user_id = query[0]['User_ID']

        payload = {
            'userID': user_id,
            'permission': permission,
            }
        encoded = jwt.encode(payload, key, algorithm='HS256')

    else:
        return json.dumps({"permission": "failure"})

    # Store authentication token in session
    session['token'] = token
    session['User_ID'] = user_id
    # Return success or failure

    return json.dumps({
        "permission": permission,
        "jwt": encoded,
        })

@app.route('/register/', methods=['POST'])
def register():
    username = request.args.get('username', None)
    password = request.args.get('password', None)
    database = db()
    with database.cursor() as cursor:
        query = query_db("SELECT COUNT(1) FROM `User` WHERE Username='" + username + "'", one=True)

        if query.get('COUNT(1)', 0) != 0:
            return json.dumps({"permission": "invalid"})
        else:
            cursor.execute("INSERT INTO `User` (`Username`,`Password`,`Role_ID`,`isInfected`) VALUES('" + username + "', '"+  password + "',1,0)")
        database.commit()
        cursor.close()
    database.close()
    
    
    return json.dumps({"success": "success"})

# Increments occupancy, returns room as JSON object
@app.route("/add/room/", methods=['POST'])
def add():
    locationID = request.args.get('locationID', None)

    if is_authenticated(request.headers):
        database = db()
        with database.cursor() as cursor:                
            # Check if user is already checked in
            query = query_db("SELECT * FROM `SignIn` WHERE User_ID = " + str(session.get('User_ID')) + " ORDER BY Sign_date DESC LIMIT 1", one=True)
            
            #if already signed in, sign them out from prev location
            if query:
                if not query.get('isCheckedOut', True):
                    cursor.execute("UPDATE `Location` SET CURRENTOCCUPANCY=CURRENTOCCUPANCY-1 WHERE LOCATION_ID = "+ str(query['Location_ID']))
                    database.commit()
                    cursor.execute("UPDATE `SignIn` SET isCheckedOut=1 WHERE Sign_ID=" + str(query['Sign_ID']))
                    database.commit()

            cursor.execute("UPDATE `Location` SET CURRENTOCCUPANCY=CURRENTOCCUPANCY+1 WHERE LOCATION_ID = " + locationID)
            database.commit()
            cursor.execute("INSERT INTO `SignIn` (`User_ID`,`Location_ID`,`Sign_Date`,`isCheckedOut`) VALUES(" + str(session.get('User_ID')) + "," + str(locationID) + ",NOW(),0)")
            database.commit()
            cursor.close()
        database.close()
        response = query_db("SELECT * FROM `Location` WHERE LOCATION_ID = " + locationID, one=True)
        if(isinstance(response, list)):
            for row in response:
                row['isInfected'] = True if (int.from_bytes(row.get('isInfected', 0), byteorder='big', signed=False)) == 1 else False
        else:
            response['isInfected'] = True if (int.from_bytes(response.get('isInfected', 0), byteorder='big', signed=False)) == 1 else False
        return json.dumps(response)
    else:
        return json.dumps({"permission": "invalid"})

# Decrements occupancy, returns room as JSON object
@app.route("/subtract/room/", methods=['GET','POST'])
def subtract():
    locationID = request.args.get('locationID', None)

    if is_authenticated(request.headers):
        database = db()
        with database.cursor() as cursor:
            #check to see if they are from this room
            query = query_db("SELECT * FROM `SignIn` WHERE User_ID = " + str(session.get('User_ID')) + " ORDER BY Sign_date DESC LIMIT 1", one=True)
            if query:
                #if signed in elsewhere, log them out
                if not query.get('isCheckedOut', True):
                    cursor.execute("UPDATE `Location` SET CURRENTOCCUPANCY=CURRENTOCCUPANCY-1 WHERE LOCATION_ID = "+ str(query['Location_ID']))
                    database.commit()
                    cursor.execute("UPDATE `SignIn` SET isCheckedOut=1 WHERE Sign_ID=" + str(query['Sign_ID']))
                    database.commit()
                    return json.dumps({"error": "not logged into this room"})
                #if just not signed into this room
                if query.get('Location_ID', '') != locationID:
                    return json.dumps({"error": "not logged into this room"})
            else:
                return json.dumps({"error": "not logged into this room"})
                
            cursor.execute("UPDATE `Location` SET CURRENTOCCUPANCY=CURRENTOCCUPANCY-1 WHERE LOCATION_ID = "+locationID)
            database.commit()
            query = query_db("SELECT Sign_ID FROM `SignIn` WHERE (User_ID= " + str(session.get('User_ID')) + "  AND Location_ID=" + locationID + ") ORDER BY Sign_date DESC LIMIT 1")
            sign_id = query[0]['Sign_ID']
            cursor.execute("UPDATE `SignIn` SET isCheckedOut=1 WHERE Sign_ID=" + str(sign_id))
            database.commit()
            cursor.close()
        database.close()
        response = query_db("SELECT * FROM `Location` WHERE LOCATION_ID = " + locationID, one=True)
        if(isinstance(response, list)):
            for row in response:
                row['isInfected'] = True if (int.from_bytes(row.get('isInfected', 0), byteorder='big', signed=False)) == 1 else False
        else:
            response['isInfected'] = True if (int.from_bytes(response.get('isInfected', 0), byteorder='big', signed=False)) == 1 else False
        return json.dumps(response)
    else:
        return json.dumps({"permission": "invalid"})


# Returns room as JSON object
@app.route("/room/", methods=['GET','POST'])
def get_room():
    locationID = request.args.get('locationID', None)
    if is_authenticated(request.headers):
        query = query_db("SELECT TOP 1 * FROM `Location` WHERE LOCATION_ID = " + locationID, one=True)
        if query['Location_ID']:
            return json.dumps(query)
        else:
            json.dumps({"permission": "invalid"})
    else:
        return json.dumps({"permission": "invalid"})

# Returns room as JSON object
@app.route("/room/current", methods=['GET','POST'])
def current_room():
    if is_authenticated(request.headers):
        query = query_db("SELECT TOP 1 * FROM `SignIn` WHERE User_ID = " + str(session.get('User_ID')) + " ORDER BY Sign_date DESC", one=True)
        if query['Location_ID']:
                return json.dumps({"Location_ID": query["Location_ID"], "checkedIn": not query["isCheckedOut"]})
        else:
            json.dumps({"permission": "invalid"})
    else:
        json.dumps({"permission": "invalid"})

# Returns JSON array of rooms
@app.route("/room/all", methods=['POST'])
def get_all_rooms():
    if is_authenticated(request.headers):
        response = query_db('SELECT * FROM `Location` ORDER BY Name, Room')
        for row in response:
            row['isInfected'] = True if (int.from_bytes(row.get('isInfected', 0), byteorder='big', signed=False)) == 1 else False
        return json.dumps(response)
    else:
        return json.dumps({"permission": "invalid"})

@app.route("/room/create/", methods=['POST'])
def create():
    building = request.args.get('building', None)
    address = request.args.get('address', None)
    room_number = request.args.get('roomNumber', None)    
    max_capacity = request.args.get('maxCapacity', None)    
    current_usage = request.args.get('currentUsage', None)    
    status = request.args.get('status', None)

    if is_authenticated(request.headers):
        database = db()
        with database.cursor() as cursor:
            if address is None:
                address = "Virginia Tech"
            if status is None:
                status = 0

            cursor.execute("INSERT INTO `Location` (`Name`,`Room`,`Address`,`Manager`,`CurrentOccupancy`,`Limit`,`isInfected`) VALUES(' " + building + "', '" + room_number + "' ,'" + address + "',0," + current_usage + "," + max_capacity + "," + status + ")")
            database.commit()
            cursor.close()
        
        database.close()
        return json.dumps(query_db("SELECT * FROM `Location` WHERE ROOM='" + room_number + "'", one=True))
    else:
        return json.dumps({"permission": "invalid"})

@app.route("/room/delete/", methods=['POST'])
def delete():
    room_number = request.args.get('roomNumber', None)

    if is_authenticated(request.headers):
        database = db()
        with database.cursor() as cursor:
            #Ensure location references in SignIn Table are deleted
            cursor.execute("DELETE FROM `SignIn` WHERE Location_ID = (SELECT Location_ID FROM `Location` WHERE ROOM= '" + room_number + "')")
            database.commit()

            cursor.execute("DELETE FROM `Location` WHERE ROOM='" + room_number + "'")
            database.commit()

            cursor.close()
        database.close()
        
        return json.dumps({"delete": "success"})
    else:
        return json.dumps({"delete": "failure"})

@app.route("/room/edit/", methods=['POST'])
def edit():
    location_id = request.args.get('locationID', None)
    building = request.args.get('building', None)
    room_number = request.args.get('roomNumber', None)    
    max_capacity = request.args.get('maxCapacity', None)    
    current_usage = request.args.get('currentUsage', None)    
    status = request.args.get('status', None)
    if is_authenticated(request.headers):
        database = db()
        with database.cursor() as cursor:
            if building is not None:
                cursor.execute("UPDATE `Location` SET NAME='" + building + "' WHERE LOCATION_ID=" + location_id)
            if room_number is not None:
                cursor.execute("UPDATE `Location` SET ROOM='" + room_number + "' WHERE LOCATION_ID=" + location_id)
            if max_capacity is not None:
                cursor.execute("UPDATE `Location` SET `LIMIT`=" + max_capacity + " WHERE LOCATION_ID=" + location_id)
            if status is not None:
                cursor.execute("UPDATE `Location` SET ISINFECTED=" + status + " WHERE LOCATION_ID=" + location_id)
            if current_usage is not None:
                cursor.execute("UPDATE `Location` SET CURRENTOCCUPANCY=" + current_usage + " WHERE LOCATION_ID=" + location_id)
            database.commit()
            cursor.close()
        database.close()

        response = query_db("SELECT * FROM `Location` WHERE LOCATION_ID=" + location_id, one=True)
        response['isInfected'] = True if (int.from_bytes(response.get('isInfected', 0), byteorder='big', signed=False)) == 1 else False
        return json.dumps(response)
    else:
        return json.dumps({"permission": "invalid"})

#TODO: Implement Trace
@app.route("/room/trace/", methods=['POST'])
def trace():
    start_day = request.args.get('startDay', None)
    end_day = request.args.get('endDay', None) 
    location_id = request.args.get('locationID', None)
    
    if is_authenticated(request.headers):
        database = db()
        with database.cursor() as cursor:
            cursor.execute("UPDATE `Location` SET CURRENTOCCUPANCY=CURRENTOCCUPANCY+1 WHERE LOCATION_ID = " + location_id)
            database.commit()
            cursor.close()
        database.close()
        return json.dumps(query_db("SELECT * FROM `Location` WHERE LOCATION_ID = " + location_id, one=True))
    else:
        return json.dumps({"permission": "invalid"})



def is_authenticated(header):
    has_session = session.get('token')
    has_jwt = False
    if('jwt' in header):
        try:
            jwt_token = jwt.decode(header.get('jwt'), \
                key, algorithms=['HS256'])
            has_jwt = 'permission' in jwt_token and 'userID' in jwt_token
            if(has_jwt):
                session['User_ID'] = jwt_token['userID']
                token = os.urandom(24)
        except Exception:
            print("Invalid JWT")
    
    return has_session or has_jwt

if __name__ == '__main__':
    #key = os.path.abspath('/etc/letsencrypt/live/api.hokiecheck.com/privkey.pem')
    #cert = os.path.abspath('/etc/letsencrypt/live/api.hokiecheck.com/cert.pem')
    app.run(host='0.0.0.0')#, ssl_context=(cert, key))