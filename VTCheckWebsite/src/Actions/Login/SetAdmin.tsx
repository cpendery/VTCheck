export const setAdmin = (admin: boolean) => {
  return {
    type: 'SetAdmin',
    admin: admin
  }
}