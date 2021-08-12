import React from 'react';

import Form from 'react-bootstrap/Form';

import styled from 'styled-components'

import {RoomFilter} from './RoomFilter';
import {BuildingFilter} from './BuildingFilter';
import {StatusFilter} from './StatusFilter';

export const FilterBar = () => {
  return(
    <Bar>
      <h3>
        Filter Results
      </h3>
    <Form>
      <Form.Row className="justify-content-center">
        <Form.Group controlId="exampleForm.ControlSelect1">
          <BuildingFilter/>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect2">
          <RoomFilter/>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect2">
          <StatusFilter/>
        </Form.Group>
      </Form.Row>
    </Form>
  </Bar>
  );
}


const Bar = styled.div`
  text-align: center;
`;