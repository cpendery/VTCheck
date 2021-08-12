import React, {FunctionComponent, useState} from 'react';

import {useSelector} from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import styled from 'styled-components'
import {Link} from "react-router-dom";
import DatePicker from "react-datepicker";
import {apiRoute} from '../Utils/route'

import {RoomFilter} from './FilterBar/RoomFilter';
import {BuildingFilter} from './FilterBar/BuildingFilter';

const CustomDatePicker: FunctionComponent<{value:any, onClick: any}> = ({value, onClick}) => {
  return(
    <button type={"button"} className={"btn btn-dark"} onClick={onClick}>
      {value}
    </button>
  );
}


export const TraceForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const loadRooms = (state: RootState) => state.loadRooms;
  const rooms: Array<Room> = useSelector(loadRooms);

  const selectBuilding = (state: RootState) => state.selectBuilding;
  const building: string = useSelector(selectBuilding);

  const selectRoom = (state: RootState) => state.selectRoom;
  const room: string = useSelector(selectRoom);

  return (
    <Form>
      <BuildingFilter/>
      <RoomFilter />
      <Form.Label>Start Date for Contact Trace</Form.Label>
      <br/>
      <DatePicker selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
        customInput={<CustomDatePicker value={startDate} onClick={setStartDate}/>}
        />
      <br/>
      <Form.Label>End Date for Contact Trace</Form.Label>
      <br/>
      <DatePicker selected={endDate}
        onChange={(date: Date) => setEndDate(date)}
        customInput={<CustomDatePicker value={endDate} onClick={setEndDate}/>}
        />
      <br/>
      <br/>
      <button type="button" className="btn btn-dark" onClick={() => {
        fireTrace(building, room, rooms, startDate, endDate);
      }}>
        Run Trace
      </button>
    </Form>
  );
}

const fireTrace = (building: string, roomNumber: string,
  rooms: Array<Room>, startDate: Date,  endDate: Date,) => {

  if(roomNumber == ""){
    alert("A room must be selected");
    return;
  }

  let room:Room = {
    id: -1,
    building: '',
    roomNumber: '',
    maxCapacity: -1,
    currentUsage: -1,
    infected: false,
  };

  const filteredRooms = rooms.filter((room:Room) => (room.building === building) 
    && (room.roomNumber === roomNumber));
  if(filteredRooms.length >= 1){
    room = filteredRooms[0];
  }
  else{
    return;
  }

  let jwt = localStorage.getItem('jwt');
  jwt = jwt !== null ? jwt : '';

  fetch(`${apiRoute}/room/trace/?&locationID=${room.id}
    &startday=${startDate.getTime()}&endday=${endDate.getTime()}`, {
    method: "POST",
    headers: {
      'jwt': jwt,
    }
  }).then(response => response.json())
  .then((data) => {
    alert(`The following pids were found in the contact trace: ${data}`);
  });

}
