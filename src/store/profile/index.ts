// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { BASE_URL } from 'src/configs/apiEndpoints';
import API from '../../configs/apiEndpoints'

// ** logout function
import { userLogout } from '../user';

interface Redux {
    getState: any
    dispatch: Dispatch<any>,
  }

export const putOrganisationLogo = createAsyncThunk('profile/uploadLogo',
  async (params: any, { dispatch, getState }: Redux) => {
    const payload ={
      file:params
    }
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .put(BASE_URL,
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
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401 || err.message === "Network Error") {
           dispatch(userLogout())
         }
        }
    }
  })

  export const putAvatar = createAsyncThunk('profile/Avatar',
  async (params: any, { dispatch, getState }: Redux) => {
    const payload ={
      avatar:params
    }
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .patch(API.uploadProfileAvatar,
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
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401 || err.message === "Network Error") {
           dispatch(userLogout())
         }
        }
    }
  })

  const profileSlice = createSlice({
    name: 'profile',
    initialState: null,
    reducers: {
  
    },
    extraReducers: builder => {
      builder.addCase(putOrganisationLogo.fulfilled, (state, action) => {
      })
      builder.addCase(putAvatar.fulfilled, (state, action) => {
      })
    }
  })
  
  export default profileSlice.reducer
