import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const useEmployeeOnboarding = () => {
  const EmployeeOnboarding = () => {
    const [isEmployeeOnboarded, setisEmployeeOnboarded] = useState(false)
    const employee = useSelector((state: RootState) => state.employee)
    const isOnboarded = employee.profile?.onboarded
    useEffect(() => {
        if (!isOnboarded) {
          setisEmployeeOnboarded(false)
        } else {
          setisEmployeeOnboarded(true)
        }
    })
    return isEmployeeOnboarded ? <div>Test</div> : null
  }
  return EmployeeOnboarding

}

export default useEmployeeOnboarding
