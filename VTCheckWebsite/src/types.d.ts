//CLASSES
interface Room {
  id: number;
  building: string;
  roomNumber: string;
  maxCapacity: number;
  currentUsage: number;
  infected: boolean; 
}

//REDUX STATE
interface RootState {
  loadRooms: any;
  filteredRooms: any;
  selectBuilding: string;
  selectRoom: string;
  selectStatus: string;
  isAdmin: boolean;
  loginNeeded: boolean;
  passwordForForm: string,
  emailForForm: string,
}

