// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { employeeCashOut, employee } from 'src/types/employee'
import { show } from '../apiError'
import { updateOnBoarding } from '../user'

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
        .put('https://api.bitleave.co/employees/onboarding',
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


export const postEmployeeCashout = createAsyncThunk('emp/cashout',
  async (params: employeeCashOut, { dispatch, getState }: Redux) => {
    console.log(params);
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

export const calculateEmployeeCashout = createAsyncThunk('emp/calculatecashout',
  async (params: number, { dispatch, getState }: Redux) => {

    try {
      const token = localStorage.getItem("accessToken");
      var data = { days: params };
      const result = await axios
        .post('https://api.bitleave.co/employeeactions/calculate', data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      console.log(result);
      return result.data
    }
    catch (e) {
      console.log(e)
    }

  })

export const getCashOutContract = createAsyncThunk('emp/cashoutcontract',
  async (params: employeeCashOut, { dispatch, getState }: Redux) => {
    console.log(params);
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
    const token = localStorage.getItem("accessToken");
    const employeeId = getState().user.id
    const result = await axios
      .get('https://api.bitleave.co/employees/' + employeeId, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
   // console.log(result.data)
    return result.data
  })

export const listEmployee = createAsyncThunk('emp/list',
  async (params: void, { dispatch, getState }: Redux) => {
    const token = localStorage.getItem("accessToken");
    const result = await axios
      .get('https://api.bitleave.co/employees/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
   // console.log(result.data)
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
      console.log(state, action);
    })

    builder.addCase(listEmployee.fulfilled, (state, action) => {
      console.log(state, action);

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
      console.log(state, action);
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

