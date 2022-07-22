// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { employeeCashOut, employee } from 'src/types/employee'
import { show } from '../apiError'

interface Redux {
  getState: any
  dispatch: Dispatch<any>,

}
export const postEmployeeCashout = createAsyncThunk('emp/cashout',
  async (params: employeeCashOut, { dispatch, getState }: Redux) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .post('https://api.bitleave.co/employeeactions/cashout',
          params,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      return response.data
    }
    catch(e){
      var data = {
        canShow: true,
        redirect: false,
        code: '',
        message: 'Error occured while processing the request',
        location: '',
      }
      return dispatch(show(data))
    }
  })

export const calculateEmployeeCashout = createAsyncThunk('emp/calculatecashout',
  async (params: number, { dispatch, getState }: Redux) => {
    
    try {
    const token = localStorage.getItem("accessToken");
    var data = { days: params};
    const result = await axios
      .post('https://api.bitleave.co/employeeactions/calculate',data, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    return result.data
  }
  catch(e){
    }

  })

  export const getCashOutContract =createAsyncThunk('emp/cashoutcontract',
  async (params: employeeCashOut, { dispatch, getState }: Redux) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .post('https://api.bitleave.co/employeeactions/cashoutcontract',
          params,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      return response.data
    }
    catch(e){
    }
  })

export const loadEmployee = createAsyncThunk('emp/load',
  async (params: string, { dispatch, getState }: Redux) => {
    const token = localStorage.getItem("accessToken");
    const result = await axios
      .get('https://api.bitleave.co/employees/' + params, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

    return result.data
  })




const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    profile: null,
    team: null,
    leaveDetail: null,
    cashoutOption: null,
    vitals: null
  } as employee,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(postEmployeeCashout.fulfilled, (state, action) => {
      debugger;
    })
    builder.addCase(postEmployeeCashout.rejected, (state, action) => {
      debugger;
    })

    builder.addCase(postEmployeeCashout.pending, (state, action) => {
    })

    builder.addCase(loadEmployee.fulfilled, (state, action) => {
      var employee = action.payload.data
      state.profile = {
        id: employee.profile.id,
        fullname: employee.profile.fullname,
        onboarded: employee.profile.onboarded
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

    })
  }
})

export default employeeSlice.reducer

