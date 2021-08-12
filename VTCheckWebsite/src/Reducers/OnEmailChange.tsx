export const onEmailChangeReducer = (state = '', action: any) => {
  if( Object.prototype.hasOwnProperty.call(action, "email")){
    return action.email;
  }
  return state;
}