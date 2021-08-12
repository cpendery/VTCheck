import React from 'react';

import Form from 'react-bootstrap/Form';
import {useDispatch} from 'react-redux';

import {selectStatus} from '../../Actions/Filter/SelectStatus';

import {useFilter} from '../../Utils/filter';
import {filterRooms} from '../../Actions/Filter/FilterRooms';

export const StatusFilter = () => {
  //grab the dispatch hook
  const dispatch = useDispatch();
  const filterObj = useFilter();

  return (
    <React.Fragment>
      <Form.Label>Select Room Status</Form.Label>
      <Form.Control as="select" onChange={(event: any) =>{
        dispatch(selectStatus(event.target.value));
        dispatch(filterRooms(filterObj.rooms, filterObj.activeBuilding, 
          filterObj.activeRoom, event.target.value));
      }
      }>
        <option value=""> </option>
        <option value="Open">Open</option>
        <option value="ClosedForCleaning">Closed For Cleaning</option>
        <option value="ClosedForCapacity">Closed For Capacity</option>
      </Form.Control>
    </React.Fragment>
  );
}