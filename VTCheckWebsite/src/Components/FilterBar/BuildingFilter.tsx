import React from 'react';

import Form from 'react-bootstrap/Form';
import {useSelector, useDispatch} from 'react-redux';

import {selectBuilding} from '../../Actions/Filter/SelectBuilding';
import {selectRoom} from '../../Actions/Filter/SelectRoom';

import {useFilter} from '../../Utils/filter';
import {filterRooms} from '../../Actions/Filter/FilterRooms';


export const BuildingFilter = () => {
  //get the buildings 
  const loadRooms = (state: RootState) => state.loadRooms;
  const rooms: Array<Room> = useSelector(loadRooms);
  const buildings = Array.from(getBuildingList(rooms));

  //grab the dispatch hook
  const dispatch = useDispatch();
  const filterObj = useFilter();

  return (
    <React.Fragment>
      <Form.Label>Select Building</Form.Label>
      <Form.Control as="select" onChange={(event: any) =>{
        dispatch(selectRoom(''));
        dispatch(selectBuilding(event.target.value));
        dispatch(filterRooms(filterObj.rooms, event.target.value, 
          filterObj.activeRoom, filterObj.activeStatus));
      }
      }>
        <option value=""> </option>
        {
        buildings.map((building: string, index: number) => {
            return(
              <option key={building}>{building}</option>
            );
          })
        }
      </Form.Control>
    </React.Fragment>
  );
}



const getBuildingList = (rooms: Array<Room>) => {
  return new Set(rooms.map((room: Room) => room.building));
}