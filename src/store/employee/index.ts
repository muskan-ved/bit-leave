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




const employeeSlice = createSlice({
  name: 'employee',
  initialState: {},
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


  }
})

export default employeeSlice.reducer

