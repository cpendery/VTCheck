export const onPasswordChange = (password: string) => {
  return {
    type: 'OnPasswordChange',
    password: password,
  }
}