// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import API from 'src/configs/apiEndpoints';
import { setup } from 'src/types/setup';

// ** Logout function
import { userLogout } from '../user';

interface Redux {
    getState: any
    dispatch: Dispatch<any>,
  }

export const setUPPost = createAsyncThunk('setup/post',
  async (params: any, { dispatch, getState }: Redux) => {
 
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .post(API.setupPost,params,
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

const setupSlice = createSlice({
    name: 'setUPPost',
    initialState: {
        id: null,
        organisationssetup:[],
    } as setup,
    reducers: {
  
    },
    extraReducers: builder => {
      builder.addCase(setUPPost.fulfilled, (state, action) => {
      })
    }
  })
  
export default setupSlice.reducer
