// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { employeeCashOut, employee } from 'src/types/employee'
import { show } from '../apiError'
import { updateOnBoarding, userLogout } from '../user'

// ** Config Var
import API from '../../configs/apiEndpoints'

interface Redux {
  getState: any
  dispatch: Dispatch<any>,

}

export const postEmployeeOnboarding = createAsyncThunk('emp/onboarding',
  async (params: any, { dispatch, getState }: Redux) => {
    console.log(params);
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
      console.log(err)
      if (axios.isAxiosError(err)) {

        // console.log(err.response?.data)
        if (!err?.response) {
            console.log("No Server Response");
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
      console.log(err)
      if (axios.isAxiosError(err)) {

        // console.log(err.response?.data)
        if (!err?.response) {
            console.log("No Server Response");
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
      console.log(result);
      return result.data
    }
    catch(err){
      console.log(err)
      if (axios.isAxiosError(err)) {

        // console.log(err.response?.data)
        if (!err?.response) {
            console.log("No Server Response");
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
      console.log(e)
      // var data = {
      //   canShow: true,
      //   redirect: false,
      //   code: '',
      //   message: 'Error occured while processing the request',
      //   location: '',
      // }
      // return dispatch(show(data))
      // return rejectWithValue(e.response.data)
    }
  })

export const loadEmployee = createAsyncThunk('emp/load',
  async (_: void, { dispatch, getState }: Redux) => {
    try{
    const token = localStorage.getItem("accessToken");
    var user;
    const userData = localStorage.getItem("userData");
    if (userData != null) {
      user = JSON.parse(userData)
    }
    const employeeId = getState().user.id
    const empId = employeeId !== null? employeeId : user.id;
    const result = await axios
      .get(API.loadEmployee + empId, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
   // console.log(result.data)
    return result.data
    } 
    catch(err){
      console.log(err)
      if (axios.isAxiosError(err)) {

        // console.log(err.response?.data)
        if (!err?.response) {
            console.log("No Server Response");
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
   // console.log(result.data)
    return result.data
    }catch(err){
      if (axios.isAxiosError(err)) {

        // console.log(err.response?.data)
        if (!err?.response) {
            console.log("No Server Response");
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
      console.log(state, action);
      // state.success = true;
      // state.isLoading = false;
    })
    builder.addCase(postEmployeeCashout.rejected, (state, action) => {
      console.log(state, action);
      // state.success = false;
      // state.isLoading = false;

    })

    builder.addCase(postEmployeeCashout.pending, (state, action) => {
    })

    builder.addCase(listEmployee.fulfilled, (state, action) => {
    })

    builder.addCase(postEmployeeOnboarding.fulfilled, (state, action) => {
      // var current = state
      // if (current != null) {
      //   state.profile = {
      //     id: current.profile.id,
      //     fullname: current.profile.fullname,
      //     onboarded: true
      //   }
      //   state.cashoutOption = current.cashoutOption

      //   state.team = current.team
      //   state.leaveDetail = current.leaveDetail
      // }

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
        department: employee.team.department,
        managerName: employee.team.managerName
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

