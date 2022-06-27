// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, ConfirmUserParams, LoginParams, ResendCodeParams,ConfirmPasswordUserParams, ErrCallbackType, UserDataType } from './types'

//Cognito Integration
import { CognitoUser, AuthenticationDetails, CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js"; //
import { resolve } from 'path'

//
const poolData = {
  UserPoolId: authConfig.userPoolId,
  ClientId: authConfig.userPoolAppClientId
}
const UserPool = new CognitoUserPool(poolData);

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  cognitoUser: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  confirmUser: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  confirmPassword: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
  confirmUserPassword: () => Promise.resolve(),
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(defaultProvider.cognitoUser)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        const userData = window.localStorage.getItem('userData')
        if (userData != null) {
          const user = JSON.parse(userData)
          setUser({ ...user })
          setLoading(false)
        }
      } else {
        setLoading(false)
        router.push('/login')
      }
    }
    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    const user = new CognitoUser({
      Username: params.email,
      Pool: UserPool
    });

    //
    const authDetails = new AuthenticationDetails({
      Username: params.email,
      Password: params.password
    });

    //
    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        const userClaims = JSON.parse(JSON.stringify(data));
        console.log(userClaims);
        const userData: UserDataType = {
          id: userClaims.idToken.payload["custom:id"],
          email: userClaims.idToken.payload.email,
          username: params.email,
          companyname: userClaims.idToken.payload["custom:companyname"],
          avatar: null,
          fullName: userClaims.idToken.payload["custom:fullname"],
          role: userClaims.idToken.payload["custom:rolename"],
          orgId: userClaims.idToken.payload["custom:orgId"],
          userOnboarded: userClaims.idToken.payload["custom:userOnboarded"]
        }
        //
        console.log(userClaims);
        window.localStorage.setItem(authConfig.storageTokenKeyName, userClaims.idToken.jwtToken) //Temporary
        setUser({ ...userData })
        window.localStorage.setItem('userData', JSON.stringify(userData))
        //
        const returnUrl = router.query.returnUrl
         const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
         router.replace(redirectURL as string)
      },
      onFailure: (err) => {
        if (errorCallback) errorCallback({ 'Message': err.message })
      },
      newPasswordRequired: (data) => {
        if (errorCallback) errorCallback({ 'Message': data.message })
      },
    });
  }

  const handleLogout = () => {
    setUser(null)
    cognitoUser?.signOut();
    setCognitoUser(null);
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .get(authConfig.apiBaseEndpoint + 'checkorganisations', {
        params: { name: params.companyname }
      })
      .then(res => {
        if (res.data.exists) {
          if (errorCallback)
            return errorCallback({ 'Message': 'Organisation already exists' })
        }

        var attributeList = [];
        var fullname = {
          Name: 'custom:fullname',
          Value: params.username,
        };
        var companyname = {
          Name: 'custom:companyname',
          Value: params.companyname
        };
        var role = {
          Name: 'custom:rolename',
          Value: 'admin' /*Only admins can sign an organisation*/
        }
        attributeList.push(new CognitoUserAttribute(fullname));
        attributeList.push(new CognitoUserAttribute(companyname));
        attributeList.push(new CognitoUserAttribute(role));
        UserPool.signUp(params.email, params.password, attributeList, [], (err, result) => {
          if (err) {
            if (errorCallback) errorCallback({ 'Message': err.message })
          }
          else {
            const emailId = params.email
            router.push({
              pathname: '/confirm-user',
              query: {
                emailId
              }
            })
          }
        })
      })
      .catch(
        (err: { [key: string]: string }) => (errorCallback ? errorCallback({ 'Message': err.message }) : null)
      )
  }

  const handleConfirmUser = (params: ConfirmUserParams, errorCallback?: ErrCallbackType) => {

    const user = new CognitoUser({
      Username: params.email,
      Pool: UserPool
    });
    user.confirmRegistration(params.code, true, function (err, result) {
      if (err) {
        if (errorCallback) errorCallback({ 'Message': err.message })
      }
      else {
        if (result === "SUCCESS") {
          router.push('/login')
        } else {

        }
      }
    });
  }

  const handleResendCode = (params: ResendCodeParams, errorCallback?: ErrCallbackType) => {

    const user = new CognitoUser({
      Username: params.email,
      Pool: UserPool
    });

    user.resendConfirmationCode(function (err, result) {
      if (err) {
        if (errorCallback) errorCallback({ 'Message': err.message })
      }
    });
  }

  const handleForgotPassword = (params: ResendCodeParams, errorCallback?: ErrCallbackType) => {
    const user = new CognitoUser({
      Username: params.email,
      Pool: UserPool
    });

    user.forgotPassword({
      onSuccess: (data) => {
        console.log(data);
        const emailId = params.email
        router.push({
          pathname: '/confirm-password',
          query: {
            emailId
          }
        })
      },
      onFailure: (err) => {
        console.log(err);
        if (err) {
          if (errorCallback) errorCallback({ 'Message': err.message })
        }
      },
    })
  }

  const handleConfirmUserPassword = (params: ConfirmPasswordUserParams, errorCallback?: ErrCallbackType) => {
    
    const {
     query: { emailId }
    } = router
  
    const props = {
     emailId
    }

   const userEmail = props.emailId 
   // const userEmail= window.localStorage.getItem("userEmail")  
     if(userEmail!= null){
        const user = new CognitoUser({
        Username: userEmail as string,
        Pool: UserPool
      });

      user.confirmPassword(params.code, params.password, {
            onFailure(err) {
              if (err) {
                if (errorCallback) errorCallback({ 'Message': err.message })
              }
              router.push('/forgot-password');
            },
            onSuccess() {
              router.push('/login');
                resolve();
            },
        });
      }
  }

  const handleConfirmPassword = (params: RegisterParams, errorCallback?: ErrCallbackType) => {

  }

  const values = {
    user,
    cognitoUser,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    confirmUser: handleConfirmUser,
    forgotPassword: handleForgotPassword,
    confirmPassword: handleConfirmPassword,
    resendCode: handleResendCode,
    confirmUserPassword : handleConfirmUserPassword
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
