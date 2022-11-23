import { CognitoUser } from "amazon-cognito-identity-js"

export type user = {
  avatar: string | null,
  companyname: string | null,
  email: string | null,
  fullName: string | null,
  id: number | null,
  orgId: number | null,
  role: string | null,
  userOnboarded: boolean | false,
  username: string | null,
  cognitoUser:CognitoUser|null
}
