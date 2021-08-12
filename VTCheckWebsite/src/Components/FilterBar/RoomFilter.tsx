import React from 'react';

import Form from 'react-bootstrap/Form';
import {useSelector, useDispatch} from 'react-redux';

import {selectRoom} from '../../Actions/Filter/SelectRoom';

import {useFilter} from '../../Utils/filter';
import {filterRooms} from '../../Actions/Filter/FilterRooms';

export const RoomFilter = () => {
  //see if we have a currently selected building
  const selectedBuilding = (state: RootState) => state.selectBuilding;
  const activeBuilding: string = useSelector(selectedBuilding);
  
  //get the buildings 
  const loadRooms = (state: RootState) => state.loadRooms;
  const rooms: Array<Room> = useSelector(loadRooms);
  const roomsInBuilding: Array<Room> = getRoomList(rooms, activeBuilding);

  //grab the dispatch hook
  const dispatch = useDispatch();
  const filterObj = useFilter();

  return (
    <React.Fragment>
      <Form.Label>Select Room</Form.Label>
      <Form.Control as="select" onChange={(event: any) =>{
        dispatch(selectRoom(event.target.value));
        dispatch(filterRooms(filterObj.rooms, filterObj.activeBuilding, 
          event.target.value, filterObj.activeStatus));
      }
      }>
        <option value=""> </option>
        {
        roomsInBuilding.map((room: Room, index: number) => {
            return(
              <option key={room.roomNumber}>{room.roomNumber}</option>
            );
          })
        }
      </Form.Control>
    </React.Fragment>
  );
}

const getRoomList = (rooms: Array<Room>, building:string): Array<Room> => {
  return rooms.filter((room: Room) => room.building === building);
}