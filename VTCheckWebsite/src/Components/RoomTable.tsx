import React, { FunctionComponent } from 'react';

import styled from 'styled-components'
import Table from 'react-bootstrap/Table';
import {useSelector} from 'react-redux';
import editIcon from '../Images/edit_icon.svg';
import deleteIcon from '../Images/delete_icon.svg';
import {
  Link,
} from "react-router-dom";
import {apiRoute} from '../Utils/route'

export const RoomTable= () => {
  const loadRooms = (state: RootState) => state.filteredRooms;
  const rooms: Array<Room> = useSelector(loadRooms);

  return(
    <React.Fragment>
      <Center>
        <AdminHeader/>
      </Center>
      
      <Table striped bordered hover variant="dark">
        <RoomTableHeader/>
        <tbody>
          {
            rooms.map((room: Room, index: number) => {
              if(room.infected){
                return (
                  <ClosedRoomRow  key={`${room.building}|${room.roomNumber}|${room.currentUsage}|${index}`}>
                    <RoomRow room={room}/>
                  </ClosedRoomRow>
                );
              }
              else if(room.currentUsage >= room.maxCapacity){
                return (
                  <FullRoomRow key={`${room.building}|${room.roomNumber}|${room.currentUsage}|${index}`}>
                    <RoomRow room={room}/>
                  </FullRoomRow>
                );
              }
              return(
                <tr key={`${room.building}|${room.roomNumber}|${room.currentUsage}|${index}`}>
                  <RoomRow room={room}/>
                </tr>
              );
            })
          }
        </tbody>
      </Table>
    </React.Fragment>
  );
}



const AdminHeader = () => {
  const loadAdminStatus = (state: RootState) => state.isAdmin;
  const admin: boolean = useSelector(loadAdminStatus);

  if(admin){
    return(
      <React.Fragment>
        <h3>Admin Dashboard</h3>
        <Link className={'btn btn-dark'}to={`/create`}>Create New Room</Link>
        <Link className={'btn btn-dark'}to={`/trace`}>Run Contact Trace</Link>
      </React.Fragment>
    );
  }
  return null;
}

const RoomTableHeader = () => {
  const loadAdminStatus = (state: RootState) => state.isAdmin;
  const admin: boolean = useSelector(loadAdminStatus);

  if(admin){
    return(
      <thead>
        <tr>
          <th>Building</th>
          <th>Room Number</th>
          <th>Current Capacity</th>
          <th>Open Status</th> 
          <th>Edit Entry</th>
          <th>Delete Entry</th>
        </tr>
      </thead>
    );
  }
  return(
    <thead>
        <tr>
          <th>Building</th>
          <th>Room Number</th>
          <th>Current Capacity</th>
          <th>Open Status</th> 
        </tr>
      </thead>
  );
}

const RoomRow: FunctionComponent<{room: Room}> = ({room}) =>{
  const loadAdminStatus = (state: RootState) => state.isAdmin;
  const admin: boolean = useSelector(loadAdminStatus);

  if(admin){
    return(
      <React.Fragment>
      <td>{room.building}</td>
      <td>{room.roomNumber}</td>
      <td>{`${room.currentUsage}/${room.maxCapacity}`}</td>
      <td>{room.infected ? 'Closed For Cleaning' : (room.currentUsage >= room.maxCapacity ? 'Full' : 'Open')}</td>
      <td>
        <Link to={`/edit/${room.id}`}>
          <ImageWraper><img className="img-responsive"src={editIcon} /></ImageWraper>
        </Link>
      </td>
      <td>
        <ImageWraper><img className="img-responsive"src={deleteIcon} onClick={() => {
          const answer = prompt("Deleting this room will remove all the contact tracing information." 
          + " If you want to delete this room, type the room number");
          if(answer === null){
            return;
          }
          const cleanAnswer = answer.replace(" ", "");
          const cleanExpected = room.roomNumber.replace(" ", "");

          if(cleanExpected === cleanAnswer){
            let jwt = localStorage.getItem('jwt');
            jwt = jwt !== null ? jwt : '';
            fetch(`${apiRoute}/room/delete/?roomNumber=${room.roomNumber}`, {
              method: "POST",
              headers: {
                'jwt': jwt,
              },
            }).then(response => response.json())
            .then((data) => {
              
              if(Object.prototype.hasOwnProperty.call(data, "delete") && data.delete === "success"){
                alert("Delete Succeeded");
                return;
              }
              alert("Delete Failed");
              return;
            })
          }
          else{
            alert("Room Number does not match");
          }
        }}/></ImageWraper>
      </td>
    </React.Fragment>
    );
  }
  return(
    <React.Fragment>
      <td>{room.building}</td>
      <td>{room.roomNumber}</td>
      <td>{`${room.currentUsage}/${room.maxCapacity}`}</td>
      <td>{room.infected ? 'Closed' : 'Open'}</td>
    </React.Fragment>
  )
}

const Center = styled.div`
  text-align: center;
`;

const ImageWraper = styled.span`
  & > img {
    cursor: pointer;
    height: 25px;
    weight: 100%;
  }
`;

const ClosedRoomRow = styled.tr`
  background-color: rgb(198, 40, 40, .7) !important;
`;
const FullRoomRow = styled.tr`
  background-color: rgb(100, 92, 23, 1) !important;
`;
