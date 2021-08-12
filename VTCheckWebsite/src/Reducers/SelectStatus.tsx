export const selectStatusReducer = (state = '', action: any) => {
  if(Object.prototype.hasOwnProperty.call(action, "status")){
    return action.status;
  }
  return state;
}