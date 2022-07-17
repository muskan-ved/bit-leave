// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

// ** Axios
import axios from 'axios'

import { resolve } from 'path'


const defaultProvider = {
  onboarding: false
}

const OnboardingContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const OnboardingProvider = ({ children }: Props) => {
  const [onboarding, setOnboarding] = useState<boolean>(defaultProvider.onboarding)

  // ** Hooks
  const router = useRouter()
  const store = useSelector((state: RootState) => state.onboarding)

  useEffect(() => {
    const initOnboarding = async (): Promise<void> => {
      const path = router.asPath
      console.log(path)
      if (path !== '/organisation/onboarding') {
        if (!store.onboardingDone) {
          const userData = window.localStorage.getItem('userData')
          console.log(path)
          if (userData) {
            const user = JSON.parse(userData)
            console.log(user);
            if (user.userOnboarded === 'false') {
              if (user.role === 'admin') {
                router.push('/organisation/onboarding')
              }
            }
          }
        }
      }

    }
    initOnboarding()
  }, [])
  const value = {
    onboarding
  }
  return <OnboardingContext.Provider value={value} >{children}</OnboardingContext.Provider>


}

export { OnboardingContext, OnboardingProvider }
