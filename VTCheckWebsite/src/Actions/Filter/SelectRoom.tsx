export const selectRoom = (room: string) => {
  return {
    type: 'SelectRoom',
    room: room
  }
}