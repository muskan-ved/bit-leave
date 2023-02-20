// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

// ** Redux Import
import {  useDispatch } from 'react-redux';

// ** Redux Store Import
import {  AppDispatch } from 'src/store';
import { loadEmployee } from 'src/store/employee'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
    if (role === 'client') return '/acl'
    else return '/home'

}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const userData = localStorage.getItem("userData")

  const fetchEmpData = async () => {
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      const roleData = empData.payload.data.role;
      if (empData && roleData) {
        const homeRoute = getHomeRoute(roleData)

        // Redirect user to Home URL
        router.replace(homeRoute)
    }
    }
  }

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    fetchEmpData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner />
}

export default Home
