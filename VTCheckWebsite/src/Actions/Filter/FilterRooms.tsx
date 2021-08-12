export const filterRooms = (rooms: Array<Room>, building:string, room:string, status:string): 
  {type:string, rooms:Array<Room>, filterBuilding:string, filterRoom:string, filterStatus:string} => {
  return {
    type: 'FilterRooms',
    rooms: rooms,
    filterBuilding: building,
    filterRoom: room,
    filterStatus: status,
  }
}