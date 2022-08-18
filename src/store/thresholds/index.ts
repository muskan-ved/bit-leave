// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { thresholds } from 'src/types/thresholds';
import { userLogout } from '../user';

interface Redux {
    getState: any
    dispatch: Dispatch<any>,
  
  }

export const excessLeaveThresholds = createAsyncThunk('excessLeaveThreadsholds',
  async (params: any, { dispatch, getState }: Redux) => {
    const payload ={
      data:params
    }
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .put('https://api.bitleave.co/organisations/thresholds',
          payload,
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
        if (!err?.response) {
            console.log("No Server Response");
         } else if (err.response?.status === 401) {
           dispatch(userLogout())
         }
        }
    }
  })

  const thresholdSlice = createSlice({
    name: 'thresholds',
    initialState: {
      id: null,
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
  
