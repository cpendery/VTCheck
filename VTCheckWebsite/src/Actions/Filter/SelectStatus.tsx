export const selectStatus = (status: string) => {
  return {
    type: 'SelectStatus',
    status: status
  }
}