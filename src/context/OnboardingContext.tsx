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
import { loadOrganisation } from 'src/store/organisation'
import { organisation } from 'src/types/organisation'


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
  const organisationStore = useSelector((state: RootState) => state.organisation)

  const store = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const initOnboarding = async (): Promise<void> => {
    const path = router.asPath
    const onboarded = store.userOnboarded

    if (path == '/login/' || path == '/logout/') {
      return;
    }

    setOnboarding(onboarded)
    if (path !== '/organisation/onboarding') {
      let orgOnBoarding: boolean
      if (!organisationStore.id) {
        //todo: get it from store
        const userData = localStorage.getItem("userData")
        let organisationID;
        if (userData != null) {
          const data = JSON.parse(userData)
          organisationID = data.id;
        }
        const organisation = await dispatch(loadOrganisation())
        orgOnBoarding = organisation.payload.data.organisation.active

      }
      else {
        orgOnBoarding = organisationStore.active
      }

      if (orgOnBoarding == false) {
        if (store.role === 'admin') {
          router.push('/organisation/onboarding')
        }
      }
      else {

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
