// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Types Imports
import { employeeCashOut, employee } from 'src/types/employee'

// ** Logout function
import { userLogout } from '../user'

// ** Config Var
import API from '../../configs/apiEndpoints'

interface Redux {
  getState: any
  dispatch: Dispatch<any>,
}

export const postEmployeeOnboarding = createAsyncThunk('emp/onboarding',
  async (params: any, { dispatch, getState }: Redux) => {
    const payload ={
      managerId:params.id
    }
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .put(API.postEmployeeOnboarding,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      await dispatch(loadEmployee())
      return response.data
    }
    catch(err){
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401) {
           dispatch(userLogout())
         }
        }
    }
  })


export const postEmployeeCashout = createAsyncThunk('emp/cashout',
  async (params: employeeCashOut, { dispatch, getState }: Redux) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .post(API.postEmployeeCashout,
          params,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      return response.data
    }
    catch(err){
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401) {
           dispatch(userLogout())
         }
        }
    }
  })

export const calculateEmployeeCashout = createAsyncThunk('emp/calculatecashout',
  async (params: number, { dispatch, getState }: Redux) => {

    try {
      const token = localStorage.getItem("accessToken");
      var data = { days: params };
      const result = await axios
        .post(API.calculateEmployeeCashout, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      return result.data
    }
    catch(err){
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401) {
           dispatch(userLogout())
         }
        }
    }

  })

export const getCashOutContract = createAsyncThunk('emp/cashoutcontract',
  async (params: employeeCashOut, { dispatch, getState }: Redux) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .post(API.getCashOutContract,
          params,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      return response.data
    }
    catch (e) {
    }
  })

export const loadEmployee = createAsyncThunk('emp/load',
  async (_: void, { dispatch, getState }: Redux) => {
    try{
    const token = localStorage.getItem("accessToken");
    const result = await axios
      .get(API.loadEmployee + "me", {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    return result.data
    } 
    catch(err){
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401) {
           dispatch(userLogout())
         }
        }
    }
  })

export const listEmployee = createAsyncThunk('emp/list',
  async (params: void, { dispatch, getState }: Redux) => {
    const token = localStorage.getItem("accessToken");
    try{
    const result = await axios
      .get(API.listEmployee, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    return result.data
    }catch(err){
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401) {
           dispatch(userLogout())
         }
        }
    }
  })


const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    profile: null,
    team: null,
    leaveDetail: null,
    cashoutOption: null,
    vitals: null,
    employeeDetail : null,
  } as employee,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(postEmployeeCashout.fulfilled, (state, action) => {
    })
    builder.addCase(postEmployeeCashout.rejected, (state, action) => {
    })
    builder.addCase(postEmployeeCashout.pending, (state, action) => {
    })
    builder.addCase(listEmployee.fulfilled, (state, action) => {
    })
    builder.addCase(postEmployeeOnboarding.fulfilled, (state, action) => {
    })
    builder.addCase(loadEmployee.fulfilled, (state, action) => {
      if(action.payload?.data){
      var employee = action.payload.data
      state.employeeDetail = {
        data: action.payload.data
      }
      state.profile = {
        id: employee.profile.id,
        fullname: employee.profile.fullname,
        onboarded: employee.profile.onboarded,
      }
      state.cashoutOption = {
        daysAvailable: employee.cashoutOptions.daysAvailable,
        cashoutAmount: employee.cashoutOptions.cashoutAmount,
        hourlyRate: employee.cashoutOptions.hourlyRate
      }

      state.team = {
        department: employee.profile.department,
        managerName: employee.profile.managerName
      }
      state.leaveDetail = {
        excessDays: employee.leaveDetails.excessDays,
        cashoutValue: employee.leaveDetails.cashoutValue,
        valueText: employee.leaveDetails.valueText
      }
    }
    })


  }
})

export default employeeSlice.reducer

