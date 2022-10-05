// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { loadOrganisation } from 'src/store/organisation'


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
    if (path == '/login/' || path == '/logout/' || path == '/register/' || path == `/confirm-user/${window.location.search}`) {
      return;
    }

    setOnboarding(onboarded)
    if (path !== '/organisation/onboarding') {
      let orgOnBoarding: boolean
      if (!organisationStore.id) {
        //todo: get it from store
        const organisation = await dispatch(loadOrganisation())
        if (organisation.payload){
        orgOnBoarding = organisation.payload.data[0].active
         } else
        orgOnBoarding = false

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
