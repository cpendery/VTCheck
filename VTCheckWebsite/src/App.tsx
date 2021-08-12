import React, { ReactElement } from 'react';
import './App.css';

import {Header} from './Components/Header';
import {FilterBar} from './Components/FilterBar/FilterBar';
import {RoomTable} from './Components/RoomTable';
import {CheckInOutForm} from './Components/CheckInOutForm';
import {EditForm} from './Components/EditForm';
import {CreateForm} from './Components/CreateForm';
import {TraceForm} from './Components/TraceForm';
import {LoginForm, RegisterForm} from './Components/LoginForm';

import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import Container from 'react-bootstrap/Container';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

import {createStore, compose} from 'redux';
import {allReducers} from './Reducers';
import {Provider, useDispatch} from 'react-redux';

import {useFetchRooms} from './Actions/LoadRooms';
import {setAdmin} from './Actions/Login/SetAdmin';

//REDUX STORE
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  allReducers,
  composeEnhancers()
  );


  export default function App():ReactElement {
    
    return (
      <div className="App">
        <Provider store={store}>
          <Container>
            <Router>
              <Switch>
                <Route path="/edit/:idParam">
                  <EditRoom />
                </Route>
                <Route path="/register">
                  <Register/>
                </Route>
                <Route path="/create">
                  <CreateRoom/>
                </Route>
                <Route path="/trace">
                  <TraceRoom/>
                </Route>
                <Route path="/:idParam">
                  <CheckInOut />
                </Route>
                <Route path="/">
                  <Home/>
                </Route>
              </Switch>
            </Router>
          </Container>
        </Provider>
      </div>
    );
  }


  function Register() {
    return(
      <React.Fragment>
        <Header/>
        <RegisterForm/>
      </React.Fragment>
      );
  }
  
  function Home() {
    //TODO (just so I can see admin pages)
    const permission = localStorage.getItem('permission');
    const dispatch = useDispatch();
    useFetchRooms();

    if(permission){
      dispatch(setAdmin(permission === 'admin'));
      
      return (
        <React.Fragment>
          <Header/>
          <FilterBar />
          <RoomTable/>
        </React.Fragment>
      );
      
    }
    else{
      return(
        <React.Fragment>
          <Header/>
          <LoginForm/>
        </React.Fragment>
        );
    }
  }

  const isAdmin = () => {
    const permission = localStorage.getItem('permission');
    return (permission && (permission === 'admin'));
  }

  const isLoggedIn = () => {
    return Boolean(localStorage.getItem('permission'));
  }

  function CreateRoom(){
    useFetchRooms();

    if(isLoggedIn() && isAdmin()){
      return(
        <React.Fragment>
          <Header/>
          <CreateForm/>
        </React.Fragment>
      );
    }
    return(
      <React.Fragment>
        <Header/>
      </React.Fragment>
    );
  }

  function TraceRoom(){
    useFetchRooms();
    if(isLoggedIn() && isAdmin()){
      return(
        <React.Fragment>
        <Header/>
        <TraceForm/>
      </React.Fragment>
      );
    }
    return(
      <React.Fragment>
        <Header/>
      </React.Fragment>
    );
  }

  function EditRoom(){
    const { idParam } = useParams();
    const id = Number(idParam);
    useFetchRooms();

    if(isLoggedIn() && isAdmin()){
      return(
        <React.Fragment>
          <Header/>
          <EditForm roomId={id}/>
        </React.Fragment>
      );
    }
    return(
      <React.Fragment>
        <Header/>
      </React.Fragment>
    );
  }
  
  function CheckInOut() {
    const { idParam } = useParams();
    const id = Number(idParam);
    useFetchRooms();
    if(isLoggedIn()){
      return(
        <React.Fragment>
          <Header/>
          <CheckInOutForm roomId={id}/>
        </React.Fragment>
      );
    }
    else{
      return Home();
    }
    
  }


  