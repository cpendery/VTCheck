export const selectRoomReducer = (state = '', action: any) => {
  if( Object.prototype.hasOwnProperty.call(action, "room")){
    return action.room;
  }
  return state;
} 