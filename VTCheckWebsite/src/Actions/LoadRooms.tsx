import {useDispatch} from 'react-redux';
import {filterRooms} from './Filter/FilterRooms';
import {apiRoute} from '../Utils/route'

export const useFetchRooms = async () => {
  const dispatch = useDispatch();
  let jwt = localStorage.getItem('jwt');
  jwt = jwt !== null ? jwt : '';
  if(jwt == ''){
    return;
  }

  const response = await fetch(`${apiRoute}/room/all`, {
    method: "POST",
    headers: {
      'jwt': jwt,
    },
  })
  const json = await response.json();
  const rooms =  json.map((entry: any) => {
    const roomEntry: Room = {
      id: entry.Location_ID,
      building: entry.Name,
      roomNumber: entry.Room,
      maxCapacity: entry.Limit,
      currentUsage: entry.CurrentOccupancy,
      infected: entry.isInfected,
    }
    return roomEntry;
  });

  const cleanRooms = rooms.map((room: Room) => {
    const newRoom: Room = {
      "building": room.building.trim(),
      "roomNumber": room.roomNumber.trim(),
      "currentUsage": room.currentUsage,
      "id": room.id,
      "infected": room.infected,
      "maxCapacity": room.maxCapacity,
    }
    return newRoom;
  });

  dispatch(loadRooms(cleanRooms));
  dispatch(filterRooms(cleanRooms, '', '', ''));
}

export const loadRooms = (rooms: Array<Room>): {type: string, rooms: Array<Room>} => {
  return {
    type: 'LoadRooms',
    rooms: rooms
  }
}