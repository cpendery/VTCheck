import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  Switch,
  Route,
  Link,
} from "react-router-dom";

import styled from 'styled-components'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import hokiecheck from '../Images/hokiecheck_text.svg';

export const Header = () => {
  const permission = localStorage.getItem('permission');
  const hasPermissions = permission !== null ? [true] : [];
  return (
    <React.Fragment>
        <Row>
          <Col>
            <Title>
              <img className="title" src={hokiecheck} />
              {
                hasPermissions.map(() => {
                  return(
                    <Logout className="btn btn-dark" key={"logout"} onClick={() => {
                      localStorage.clear();
                      window.location.reload(false);
                    }}>Logout</Logout>
                  )
                })
              }
            </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Center>
              <Switch>
                 <Route path="/:id">
                  <Link to="/" className="btn btn-dark"> Go To Home Page </Link>
                 </Route>
              </Switch>
            </Center>
          </Col>            
        </Row>
    </React.Fragment>
  );
}

export default Header;

const Logout = styled.button`
  position: absolute;
  top: 0;
  right: 0;
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
  margin-top: 10px;
`;


const Center = styled.div`
  margin-bottom: 20px;
  text-align: center;
`


