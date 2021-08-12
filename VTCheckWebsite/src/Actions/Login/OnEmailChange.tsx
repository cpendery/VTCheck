export const onEmailChange = (email: string) => {
  return {
    type: 'OnEmailChange',
    email: email,
  }
}