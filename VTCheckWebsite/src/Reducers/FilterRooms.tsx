export const filterRoomsReducer = (state = [], action: any) => {
  let toReturn = state
  
  if(Object.prototype.hasOwnProperty.call(action, "rooms")){
    toReturn = action.rooms;

    if(action.filterBuilding !== ''){
      toReturn = toReturn.filter((room: Room) => room.building === action.filterBuilding);
    }
    if(action.filterRoom !== ''){
      toReturn = toReturn.filter((room: Room) => room.roomNumber === action.filterRoom);
    }
    if(action.filterStatus !== ''){
      console.log(action.filterStatus);
      switch(action.filterStatus){
        case "Open":
          console.log(toReturn);
          toReturn = toReturn.filter((room:Room) => room.infected === false && (room.currentUsage < room.maxCapacity));
          break;
        case "ClosedForCleaning":
          toReturn = toReturn.filter((room:Room) => room.infected === true);
          break;
        case "ClosedForCapacity":
          toReturn = toReturn.filter((room:Room) => room.infected === false && (room.currentUsage >= room.maxCapacity));
          break;
      }
    }
  }
  return toReturn;
}