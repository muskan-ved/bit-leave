import Alert from '@mui/material/Alert';
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store"

const ErrorComponent = () => {
  const router = useRouter()
  const store = useSelector((state: RootState) => state.apierror)
  if (store.redirect) {
    router.push('/login')
  }
  // useEffect(() => {
  //   if(store.redirect){
  //     router.push('/login')
  //   }

  // }, [])
  return (
    <>{
      store.canShow == true &&
        <Alert variant="outlined" severity="error">{store.message}</Alert>
    }</>

  )
}

export default ErrorComponent
