export const selectBuildingReducer = (state = '', action: any) => {
  if( Object.prototype.hasOwnProperty.call(action, "building")){
    return action.building;
  }
  return state;
}