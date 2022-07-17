// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { employeeCashOut } from 'src/types/employee'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}
export const postEmployeeCashout = createAsyncThunk('emp/cashout',
  async (params: employeeCashOut, { dispatch, getState }: Redux) => {
    console.log(params);
    const token = localStorage.getItem("accessToken");

  })

export const loadEmployee = createAsyncThunk('emp/load',
  async (params: string, { dispatch, getState }: Redux) => {
    console.log(params);
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
  },
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

    builder.addCase(loadEmployee.fulfilled, (state, action) => {
      console.log(state, action);
      var employee =action.payload

    })


  }
})

export default employeeSlice.reducer

