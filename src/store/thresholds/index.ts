// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { thresholds } from 'src/types/thresholds';
import { userLogout } from '../user';

// ** Config Var
import API from '../../configs/apiEndpoints'

interface Redux {
    getState: any
    dispatch: Dispatch<any>,
  
  }

export const getExcessLeave = createAsyncThunk('excessLeaveData',
  async (_: void, { dispatch, getState }: Redux) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .get(API.loadOrganisation,
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

export const excessLeaveThresholds = createAsyncThunk('excessLeaveThreadsholds',
  async (params: any, { dispatch, getState }: Redux) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .patch(API.updateThresholds,
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

  const thresholdSlice = createSlice({
    name: 'thresholds',
    initialState: {
      organisationssettings: [],
    } as thresholds,
    reducers: {
  
    },
    extraReducers: builder => {
      builder.addCase(excessLeaveThresholds.fulfilled, (state, action) => {
      })
    }
  })
  
  export default thresholdSlice.reducer
  
