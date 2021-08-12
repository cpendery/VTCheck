export const onPasswordChangeReducer = (state = '', action: any) => {
  if( Object.prototype.hasOwnProperty.call(action, "password")){
    return action.password;
  }
  return state;
}