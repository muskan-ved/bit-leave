// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Toast Import
import toast from 'react-hot-toast';

// ** Config variables
import API from 'src/configs/apiEndpoints';

// ** Redux Import
import { actionApproval } from 'src/types/actionApproval';

// ** Logout function
import { userLogout } from '../user';

interface Redux {
    getState: any
    dispatch: Dispatch<any>,
  }

export const cashoutActionApproval = createAsyncThunk('cashout/actionApproval',
  async (id: any, { dispatch, getState }: Redux) => {
 
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .get(API.cashoutActionApproval + id,
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
        return err
    }
  })

  export const cashoutUploadActionApproval = createAsyncThunk('cashout/uploadActionApproval',
  async (params: any, { dispatch, getState }: Redux) => {
 
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .post(API.uploadActionApproval,params,
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
        return err
        }
    }
  }) 

const actionApprovalSlice = createSlice({
    name: 'actionApproval',
    initialState: {
      CashoutDays: null,
      CashoutAmount: null,
      RequestDate: null,
      CashoutReason: null,
      EmployeeName: null,
    } as actionApproval,
    reducers: {
  
    },
    extraReducers: builder => {
      builder.addCase(cashoutActionApproval.fulfilled, (state, action) => {
      })
    }
  })
  
export default actionApprovalSlice.reducer
