// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, ConfirmUserParams, LoginParams, ErrCallbackType, UserDataType } from './types'

//Cognito Integration
import { CognitoUser, AuthenticationDetails, CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js"; //
import { captureRejectionSymbol } from 'stream'
import Register from 'src/pages/register'
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
  confirmPassword: () => Promise.resolve()
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
        // await axios
        //   .get(authConfig.meEndpoint, {
        //     headers: {
        //       Authorization: storedToken
        //     }
        //   })
        //   .then(async response => {
        //     setLoading(false)
        //     setUser({ ...response.data.userData })
        //   })
        //   .catch(() => {
        //     localStorage.removeItem('userData')
        //     localStorage.removeItem('refreshToken')
        //     localStorage.removeItem('accessToken')
        //     setUser(null)
        //     setLoading(false)
        //   })
      } else {
        setLoading(false)
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
        //
        // const userData = {
        //   id: 1,
        //   email: params.email,
        //   password: params.password,
        //   username: params.email,
        //   companyname: '',
        //   avatar: null,
        //   fullName: '',
        //   role: 'admin'
        // }
        // //
        // window.localStorage.setItem(authConfig.storageTokenKeyName, userClaims.accessToken.jwtToken)
        // setUser({ ...userData })
        // window.localStorage.setItem('userData', JSON.stringify(userData))
      },
      onFailure: (err) => {
        if (errorCallback) errorCallback({ 'Message': err.message })
      },
      newPasswordRequired: (data) => {
        console.log("newPasswordrequired: ", data);
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

    //Check Company Exists

    var attributeList = [];
    //
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
      Value: 'Admin'
    }
    attributeList.push(new CognitoUserAttribute(fullname));
    attributeList.push(new CognitoUserAttribute(companyname));
    attributeList.push(new CognitoUserAttribute(role));
    UserPool.signUp(params.email, params.password, attributeList, [], (err, result) => {
      if (err) {
        if (errorCallback) errorCallback({ 'Message': err.message })
      }
      else {
        //Add Organisation and User to DB
        handleLogin({ email: params.email, password: params.password })
      }
    })
  }

  const handleConfirmUser = (params: ConfirmUserParams, errorCallback?: ErrCallbackType) => {
    
    const user = new CognitoUser({
      Username: params.email,
      Pool: UserPool
    });
    user.confirmRegistration(params.code, true, function(err, result) {
      if (err) {
        if (errorCallback) errorCallback({ 'Message': err.message })
      }
      else {
        if(result === "SUCCESS"){
          router.push('/login' )
        }else{

        }
      }
    });
  }

  const handleForgotPassword = (userName: string, errorCallback?: ErrCallbackType) => {
    const user = new CognitoUser({
      Username: userName,
      Pool: UserPool
    });

    user.forgotPassword({
      onSuccess: (data) => {
        console.log(data)
      },
      onFailure: (err) => {
        console.log('ERR:', err)
      },
    })
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
    confirmUser : handleConfirmUser,
    forgotPassword: handleForgotPassword,
    confirmPassword: handleConfirmPassword
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
