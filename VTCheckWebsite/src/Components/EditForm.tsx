import React, {FunctionComponent, useState} from 'react';

import {useSelector} from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import styled from 'styled-components'
import {Link} from "react-router-dom";
import {apiRoute} from '../Utils/route'


export const EditForm: FunctionComponent<{roomId:number}> = ({roomId}) => {
  const loadRooms = (state: RootState) => state.loadRooms;
  const rooms: Array<Room> = useSelector(loadRooms);
  const filteredRooms = rooms.filter((room:Room) => room.id === roomId);
  let room:Room = {
    id: -1,
    building: '',
    roomNumber: '',
    maxCapacity: -1,
    currentUsage: -1,
    infected: false,
  };
  if(filteredRooms.length === 1){
    room = filteredRooms[0];
  }


  //setup form states
  const [building, setBuilding] = useState(room.building);
  const handleSetBuilding = (event: any) => setBuilding(event.target.value);

  const [roomNumber, setRoomNumber] = useState(room.roomNumber);
  const handleSetRoomNumber = (event: any) => setRoomNumber(event.target.value);

  const [currentUsage, setCurrentUsage] = useState(room.currentUsage);
  const handleSetCurrentUsage = (event: any) => setCurrentUsage(event.target.value);

  const [maxCapacity, setMaxCapacity] = useState(room.maxCapacity);
  const handleSetMaxCapacity = (event: any) => setMaxCapacity(event.target.value);

  const [infected, setInfected] = useState(room.infected);
  const handleSetInfected = (value: boolean) => setInfected(value);

  if(filteredRooms.length !== 1){
    return null;
  }

  return (
    <Form>
      <Form.Group >
        <Form.Label>Building</Form.Label>
        <Form.Control placeholder="Building Name" defaultValue={building} 
          onChange={handleSetBuilding}/>
      </Form.Group>
      <Form.Group>
        <Form.Label>RoomNumber</Form.Label>
        <Form.Control placeholder="Room Number" defaultValue={roomNumber}
          onChange={handleSetRoomNumber}/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Current Usage</Form.Label>
        <Form.Control placeholder="Current Usgae" defaultValue={currentUsage}
          onChange={handleSetCurrentUsage}/>
        
      </Form.Group>
      <Form.Group>
        <Form.Label>Max Capacity</Form.Label>
        <Form.Control  placeholder="Max Capacity" defaultValue={maxCapacity}
          onChange={handleSetMaxCapacity}/>
      </Form.Group>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={2}>
            Status
          </Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="Open"
              checked={!infected}
              onChange={() => handleSetInfected(false)}
            />
            <Form.Check
              type="radio"
              label="Closed"
              checked={infected}
              onChange={() => handleSetInfected(true)}
            />
          </Col>
        </Form.Group>
      </fieldset>
      <Center>
        <Link to="/" className="btn btn-dark" onClick={(e: any) => {
          fireEdit(roomId, building, roomNumber, currentUsage, maxCapacity, infected);
        }}> Submit Edits </Link>
      </Center>
    </Form>
  );
}


const fireEdit = (
  roomId: number,
  building: string,
  roomNumber: string,
  currentUsage: number,
  maxCapacity: number, 
  infected: boolean,
) => {
    let jwt = localStorage.getItem('jwt');
    jwt = jwt !== null ? jwt : '';

    const infectedBit = infected ? 1 : 0;

    fetch(`${apiRoute}/room/edit/?locationID=${roomId}&building=${building}&roomNumber=${roomNumber}&maxCapacity=${maxCapacity}&currentUsage=${currentUsage}&status=${infectedBit}`, {
      method: "Post",
      headers: {
        'jwt': jwt,
      }
    });

}

const Center = styled.div`
  text-align: center;
`;