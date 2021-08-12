import React, {FunctionComponent} from 'react';
import styled from 'styled-components'
import {useSelector} from 'react-redux';
import {
  Link,
} from "react-router-dom";
import Badge from 'react-bootstrap/Badge';
import {apiRoute} from '../Utils/route'

export const CheckInOutForm: FunctionComponent<{roomId:number}> = ({roomId}) => {
  const loadRooms = (state: RootState) => state.loadRooms;
  const rooms: Array<Room> = useSelector(loadRooms);

  const filteredRooms = rooms.filter((room:Room) => room.id === roomId);
  console.log(filteredRooms);
  if(filteredRooms.length !== 1){
    return null;
  }
  const room:Room = filteredRooms[0];

  const activeRoom: string = room.roomNumber;
  const activeBuilding: string = room.building;

  return (
    <Form>
      <h3>Building:  <Badge variant="dark">{activeBuilding}</Badge></h3>
      <h3>Room: <Badge variant="dark">{activeRoom}</Badge></h3>
      <Link to="/" className="btn btn-success" onClick={() => {
        fireCheckInOut(rooms, activeBuilding, activeRoom, true);
      }}> Check In </Link>
      <Link to="/" className="btn btn-danger" onClick={() => {
        fireCheckInOut(rooms, activeBuilding, activeRoom, false);
      }}> Check Out </Link>
    </Form>
  );
}




const fireCheckInOut = (rooms: Array<Room>, activeBuilding: string, activeRoom: string, isCheckIn: boolean) => {
  const result: Array<Room> = rooms.filter((room: Room) => {
    return room.building === activeBuilding && room.roomNumber === activeRoom;
  });

  //make sure the form has valid values  and has match
  if(activeBuilding === '' || activeRoom === ''){
    return null;
  }
  if(result.length === 0){
    return null;
  }

  const room: Room = result[0];

  let jwt = localStorage.getItem('jwt');
  jwt = jwt !== null ? jwt : '';

  if(isCheckIn){
    fetch(`${apiRoute}/add/room?locationID=${room.id}`, {
      method: "POST",
      headers: {
        'jwt': jwt,
      },
    })
  }
  else{
    fetch(`${apiRoute}/subtract/room?locationID=${room.id}`, {
      method: "POST",
      headers: {
        'jwt': jwt,
      },
    })
  }
}

const Form = styled.div`
  text-align: center;
`;