// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

import { loadEmployee } from 'src/store/employee'
import { getUser, updateOnBoarding } from 'src/store/user'

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
  const store = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const initOnboarding = async (): Promise<void> => {
    const path = router.asPath
    const onboarded = store.userOnboarded
    setOnboarding(onboarded)
    if (path !== '/organisation/onboarding') {
      if (!onboarding) {
        if (store) {
          const employeeId = store.id;
          console.log('employeeId', employeeId)
          if (employeeId) {
            const employee = await dispatch(loadEmployee(employeeId));
            console.log(employee)
            if (employee.payload?.data != null) {
              if (employee.payload.data.profile) {
                if (!employee.payload.data.profile.onboarded) {
                  if (store.role === 'admin') {
                    router.push('/organisation/onboarding')
                  }
                }
                else {
                  setOnboarding(true)
                  dispatch(updateOnBoarding(true))
                }
              }
            }
          }
        }
        else {
          console.log('else ')

        }
      }
    }

  }

  useEffect(() => {
    initOnboarding()
  }, [router.route])
  const value = {
    onboarding
  }
  return <OnboardingContext.Provider value={value} >{children}</OnboardingContext.Provider>


}

export { OnboardingContext, OnboardingProvider }
