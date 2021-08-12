import {useSelector} from 'react-redux';

export const useFilter = () => {
  const selectedRoom = (state: RootState) => state.selectRoom;
  const activeRoom: string = useSelector(selectedRoom);

  const selectedBuilding = (state: RootState) => state.selectBuilding;
  const activeBuilding: string = useSelector(selectedBuilding);

  const selectedStatus = (state: RootState) => state.selectStatus;
  const activeStatus: string = useSelector(selectedStatus);

  const loadedRooms = (state: RootState) => state.loadRooms;
  const rooms: Array<Room> = useSelector(loadedRooms);

  return {
    'rooms': rooms,
    'activeRoom': activeRoom,
    'activeBuilding': activeBuilding,
    'activeStatus': activeStatus,
  }
}