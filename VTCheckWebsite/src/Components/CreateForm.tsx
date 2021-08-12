import React, {useState} from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import styled from 'styled-components'
import {Link} from "react-router-dom";
import {apiRoute} from '../Utils/route'


export const CreateForm = () => {
  //setup form states
  const [building, setBuilding] = useState('');
  const handleSetBuilding = (event: any) => setBuilding(event.target.value);

  const [roomNumber, setRoomNumber] = useState('');
  const handleSetRoomNumber = (event: any) => setRoomNumber(event.target.value);

  const [currentUsage, setCurrentUsage] = useState(0);
  const handleSetCurrentUsage = (event: any) => setCurrentUsage(event.target.value);

  const [maxCapacity, setMaxCapacity] = useState(0);
  const handleSetMaxCapacity = (event: any) => setMaxCapacity(event.target.value);

  const [infected, setInfected] = useState(false);
  const handleSetInfected = (value: boolean) => setInfected(value);

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
          fireCreate(building.trim(), roomNumber.trim(), currentUsage, maxCapacity, infected);
        }}> Create Room </Link>
      </Center>
    </Form>
  );
}


const fireCreate = (
  building: string,
  roomNumber: string,
  currentUsage: number,
  maxCapacity: number, 
  infected: boolean,
) => {
    let jwt = localStorage.getItem('jwt');
    jwt = jwt !== null ? jwt : '';

    const infectedBit = infected ? 1 : 0;

    fetch(`${apiRoute}/room/create/?&building=${building}&roomNumber=${roomNumber}&maxCapacity=${maxCapacity}&currentUsage=${currentUsage}&status=${infectedBit}`, {
      method: "POST",
      headers: {
        'jwt': jwt,
      }
    });

}

const Center = styled.div`
  text-align: center;
`;