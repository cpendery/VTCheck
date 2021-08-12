import React from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {onEmailChange} from '../Actions/Login/OnEmailChange';
import {onPasswordChange} from '../Actions/Login/OnPasswordChange';
import {setAdmin} from '../Actions/Login/SetAdmin';


import Form from 'react-bootstrap/Form';
import styled from 'styled-components'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import {apiRoute} from '../Utils/route'

export const RegisterForm = () => {
  const dispatch = useDispatch();

  const passwordState = (state: RootState) => state.passwordForForm;
  const password: string = useSelector(passwordState);
  const emailState = (state: RootState) => state.emailForForm;
  const email: string = useSelector(emailState);

  return(
    <Center>
      <Row>
        <Col md={3}/>
        <Col md={6}>
          <h3>Register Account</h3>
          <Form id="registrationForm">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(event:any) => {
                dispatch(onEmailChange(event.target.value));
              }}/>
              <Form.Text className="text-muted">
                This must be your VT email
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(event:any) => {
                dispatch(onPasswordChange(event.target.value));
              }}/>
            </Form.Group>
            <Button variant="success" onClick={() => {
              const validEmail = verifyEmail(email);
              if(validEmail){
                const username = parseUsername(email);
                register(username, password, dispatch);
              }
              else{
                alert("Invalid Email. Must be your VT email");
              }
              
            }}>Register Account</Button>{' '}
          </Form>
        </Col>
        <Col md={3}/>
      </Row>
    </Center>
  );
}

export const LoginForm = () => {
  const dispatch = useDispatch();

  const passwordState = (state: RootState) => state.passwordForForm;
  const password: string = useSelector(passwordState);
  const emailState = (state: RootState) => state.emailForForm;
  const email: string = useSelector(emailState);

  return(
    <Center>
      <Row>
        <Col md={3}/>
        <Col md={6}>
          <h3>Log Into Account</h3>
          <Form id="registrationForm">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(event:any) => {
                dispatch(onEmailChange(event.target.value));
              }}/>
              <Form.Text className="text-muted">
                This must be your VT email
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(event:any) => {
                dispatch(onPasswordChange(event.target.value));
              }}/>
            </Form.Group>
            <Button variant="success" onClick={() => {
              const validEmail = verifyEmail(email);
              if(validEmail){
                const username = parseUsername(email);
                login(username, password, dispatch);
              }
              else{
                alert("Invalid Email. Must be your VT email");
              }
              
            }}>Login</Button>{' '}
            <Form.Text className="text-muted">
              <Link to="/register">
                Click here to register an account
              </Link>
            </Form.Text>
          </Form>
        </Col>
        <Col md={3}/>
      </Row>
    </Center>
  );
}

const verifyEmail = (email:string) => {
  const regex = /([A-Za-z!#$%&'*+\-/=?^_`{|]+@vt.edu)/g;
  return regex.test(email);
}
const parseUsername = (email:string) => {
  const regex = /@/g;
  const splits = email.split(regex);
  if(splits.length !== 0){
    return splits[0];
  }
  return '';
}

const login = async (username:string, password:string, dispatch:any) => {
  const response = await fetch(`${apiRoute}/login?username=${username}&password=${password}`, 
  {
    method: "POST",
  });
  const json = await response.json();
  console.log(json);
  //successful login
  
  if(Object.prototype.hasOwnProperty.call(json, "jwt")){
    const isAdmin = json.permission === "admin";
    dispatch(setAdmin(isAdmin));
    localStorage.setItem('permission', json.permission);
    localStorage.setItem('jwt', json.jwt);
    window.location.reload(false);
  }
  else{
    alert("Username or Password is Incorrect");
  }
}

const register = async (username:string, password:string, dispatch:any) => {

  const response = await fetch(`${apiRoute}/register?username=${username}&password=${password}`, {
    method: "POST"
  });
  const json = await response.json();

  //successful registration
  if(Object.prototype.hasOwnProperty.call(json, "success")){
    login(username, password, dispatch);
  }
  else{
    alert("Registration Failed");
  }
}


const Center = styled.div`
  text-align: center;
`;