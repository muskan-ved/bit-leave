// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

import { loadEmployee } from 'src/store/employee'

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
  const dispatch = useDispatch<AppDispatch>()

  const checkIfOnboarded = async () => {

  }

  useEffect(() => {
    const initOnboarding = async (): Promise<void> => {
      const path = router.asPath

      console.log(path)
      if (path !== '/organisation/onboarding') {
        if (!store.onboardingDone) {
          const userData = window.localStorage.getItem('userData')
          const storedUser = JSON.parse(userData)
          const employeeId = storedUser.id;
          const employee = await dispatch(loadEmployee(employeeId));
          console.log(employee)
          if (employee.payload.data.profile) {

            const user = JSON.parse(userData)
            console.log(user);
            if (!employee.payload.data.profile.onboarded) {
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
