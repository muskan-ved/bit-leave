import { CognitoUser } from "amazon-cognito-identity-js"

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
}

export type RegisterParams = {
  email: string
  username: string
  password: string
  companyname: string
}

export type ConfirmUserParams = {
  email: string
  code : string
}

export type ResendCodeParams = {
  email: string
}

export type ConfirmPasswordUserParams = {
  code: string,
  password: string
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  companyname: string
  avatar?: string | null
  orgId :string
  userOnboarded : boolean
  cognitoUser:CognitoUser|null

}

export type AuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: UserDataType | null
  cognitoUser : CognitoUser | null
  setUser: (value: UserDataType | null) => void
  setIsInitialized: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  confirmUser : (params: ConfirmUserParams, errorCallback?: ErrCallbackType) => void
  forgotPassword : (params: ResendCodeParams, errorCallback?: ErrCallbackType) => void
  confirmPassword : (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  resendCode : (params: ResendCodeParams, errorCallback?: ErrCallbackType) => void
  confirmUserPassword : (params: ConfirmPasswordUserParams, errorCallback?: ErrCallbackType) => void
}
