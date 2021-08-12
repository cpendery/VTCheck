import {selectBuildingReducer} from './SelectBuilding';
import {selectRoomReducer} from './SelectRoom';
import {selectStatusReducer} from './SelectStatus';
import {setAdminReducer} from './SetAdmin';
import {onEmailChangeReducer} from './OnEmailChange';
import {onPasswordChangeReducer} from './OnPasswordChange';
import {filterRoomsReducer} from './FilterRooms';
import {loadRoomsReducer} from './LoadRooms';
import {combineReducers} from 'redux';

export const allReducers = combineReducers({
  passwordForForm: onPasswordChangeReducer,
  emailForForm: onEmailChangeReducer,
  loadRooms: loadRoomsReducer,
  selectBuilding: selectBuildingReducer,
  selectRoom: selectRoomReducer,
  isAdmin: setAdminReducer,
  selectStatus: selectStatusReducer,
  filteredRooms: filterRoomsReducer,
})