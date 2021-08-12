export const setAdminReducer = (state = false, action: any) => {
  if( Object.prototype.hasOwnProperty.call(action, "admin")){
    return action.admin;
  }
  return state;
}