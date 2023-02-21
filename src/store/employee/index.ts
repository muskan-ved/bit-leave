// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Types Imports
import { employeeCashOut, employee, scenariosAnalytics } from 'src/types/employee'

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
         } else if (err.response?.status === 401 || err.message === "Network Error") {
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
         } else if (err.response?.status === 401 || err.message === "Network Error") {
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
         } else if (err.response?.status === 401 || err.message === "Network Error") {
           dispatch(userLogout())
         }
        }
        return err
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
    const userData = window.localStorage.getItem("userData")
    let data;
    if (userData != null) {
        data = JSON.parse(userData)
      }  
    const result = await axios
      .get(API.loadEmployee, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
     
      const roleIdentifier = result.data.data.role === 2 ? 'user' : result.data.data.role === 3 ? 'viewer' : result.data.data.role === 1 ? 'admin': data.role
      const mergeData = ({...data,'role':roleIdentifier})
      localStorage.setItem('userData',JSON.stringify(mergeData))
    return result.data
    } 
    catch(err){
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401 || err.message === "Network Error") {
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
         } else if (err.response?.status === 401 || err.message === "Network Error") {
           dispatch(userLogout())
         }
        }
    }
  })

  export const allEmployeeList = createAsyncThunk('allEmp/list',
  async (_: void, { dispatch, getState }: Redux) => {
    const token = localStorage.getItem("accessToken");
    try{
    const result = await axios
      .get(API.allEmployeeList, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    return result.data
    }catch(err){
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401 || err.message === "Network Error") {
           dispatch(userLogout())
         }
        }
    }
  })

  export const loadDashboardAnalytics = createAsyncThunk('analytics',
  async (_: void, { dispatch, getState }: Redux) => {
    try{
    const token = localStorage.getItem("accessToken");

    const result = await axios
      .get(API.dashboardAnalytics, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    return result.data
    } 
    catch(err){
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401 || err.message === "Network Error") {
           dispatch(userLogout())
         }
        }
    }
  })

  export const loadDashboardSenariosAnalytics = createAsyncThunk('senario/analytics',
  async (params: scenariosAnalytics, { dispatch, getState }: Redux) => {
    try{
    const token = localStorage.getItem("accessToken");

    const result = await axios
      .get(`${API.dashboardSenariosAnalytics}?headCount=${params.Headcount}&averageSalary=${params.AverageSalary} `, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    return result.data
    } 
    catch(err){
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401 || err.message === "Network Error") {
           dispatch(userLogout())
         }
        }
    }
  })


const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    avatar: null,
    firstname: null,
    lastname: null,
    email: null,
    role: null,
    department: null,
    country: null,
    fullname: null,
    jobtitle: null,
    onboarded: false,
    id: null,
    orgs: [],
    pages : [],
    cashoutOption:null
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
    builder.addCase(loadDashboardAnalytics.fulfilled, (state, action) => {
      const payloadData = action?.payload?.data?.pages
      if(payloadData){
        state.pages= payloadData
      }
    })
    builder.addCase(loadDashboardSenariosAnalytics.fulfilled, (state, action) => {
    })
    builder.addCase(loadEmployee.fulfilled, (state, action) => {
      const payloadData = action?.payload?.data
      if(payloadData){

        state.avatar= payloadData.avatar
        state.firstname= payloadData.firstname
        state.lastname= payloadData.lastname
        state.email= payloadData.email
        state.role= payloadData.role
        state.department= payloadData.department
        state.country= payloadData.country
        state.fullname= payloadData.fullname
        state.jobtitle= payloadData.jobtitle
        state.onboarded= payloadData.onboarded
        state.id= payloadData.id
        state.orgs= payloadData.orgs
    }
    })


  }
})

export default employeeSlice.reducer

