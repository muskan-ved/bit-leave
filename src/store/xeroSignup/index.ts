// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Config variables
import API from 'src/configs/apiEndpoints';

// ** Logout function
import { userLogout } from '../user';

interface Redux {
    getState: any
    dispatch: Dispatch<any>,
  }

export const xeroRedirectUrl = createAsyncThunk('xero/loginUrl',
  async (_: void, { dispatch, getState }: Redux) => {
 
    try {
      const response = await axios
        .get(API.XeroRedirectURL);
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


const xeroRedirectUrlSlice = createSlice({
    name: 'xeroRedirectUrl',
    initialState: {
      url: null,
    },
    reducers: {
  
    },
    extraReducers: builder => {
      builder.addCase(xeroRedirectUrl.fulfilled, (state, action) => {
      })
    }
  })
  
export default xeroRedirectUrlSlice.reducer
