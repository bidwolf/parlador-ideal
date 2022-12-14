import { User } from '../models/User'
export const isValidEmail = (email: string) => {
  const regexEmail = RegExp(/\S+@\S+\.\S+/)
  return regexEmail.test(email)
}
export const emailValidate = (email: string) => {
  if (!email) {
    throw {
      code: 422,
      errorMessage:
        'User cannot be registered, you need to provide an email to register.',
    }
  }
  if (!isValidEmail(email)) {
    throw {
      code: 422,
      errorMessage:
        'User cannot be registered, you need to provide an valid email.',
    }
  }
}
export const passwordValidate = (
  password: string,
  passwordConfirmation?: string
) => {
  if (!password || password.length == 0) {
    throw { code: 422, errorMessage: 'You need to provide an password.' }
  }
  if (password.length < 8) {
    throw {
      code: 422,
      errorMessage: 'Your password must be 8 characters or more.',
    }
  }
  if (password !== passwordConfirmation) {
    throw { code: 422, errorMessage: 'You need to confirm your password.' }
  }
}
export const nameValidate = (name: string) => {
  //implementar parser de string sanitizeName(name:string):string
  if (!name || name == '') {
    throw { code: 422, errorMessage: 'You must enter a name in the register.' }
  }
}
export const validateInput = (user: User) => {
  emailValidate(user.email)
  passwordValidate(user.password, user.passwordConfirmation)
  nameValidate(user.name)
}
