export const loadRoomsReducer = (state = [], action: any) => {
 
  if( Object.prototype.hasOwnProperty.call(action, "rooms")){
    return action.rooms;
  }
  return state;
}