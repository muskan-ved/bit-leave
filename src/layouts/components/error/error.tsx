import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store"

const ErrorComponent = () => {
  const router = useRouter()
  const store = useSelector((state: RootState) => state.apierror)
  if(store.redirect){
    router.push('/login')
  }
  // useEffect(() => {
  //   if(store.redirect){
  //     router.push('/login')
  //   }

  // }, [])
  return(
    <div>
      {store.message}
    </div>
  )
}

export default ErrorComponent
