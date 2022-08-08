// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { AppDispatch } from 'src/store'
import { useDispatch } from 'react-redux'
import { refreshUserState } from 'src/store/user'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()


  useEffect(
    () => {
      if (!router.isReady) {
        return
      }
      const userData = window.localStorage.getItem('userData')

      if (auth.user === null && !userData) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
      if (userData != null) {
        dispatch(refreshUserState(JSON.parse(userData)))
      }
      
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  if (auth.loading || auth.user === null) {
    return fallback
  }

  // Remove unwanted localStorage
  var keys = Object.keys(localStorage)
  for(var i = 0; i<keys.length; i++){
    if(keys[i].slice(0,30) === "CognitoIdentityServiceProvider"){
      window.localStorage.removeItem(keys[i])
    }
  }

  return <>{children}</>
}

export default AuthGuard
