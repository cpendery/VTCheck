export const selectBuilding = (building: string) => {
  return {
    type: 'SelectBuilding',
    building: building
  }
}