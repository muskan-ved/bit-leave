// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
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
        .put('http://localhost:3000/endpiont/',
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

  const profileSlice = createSlice({
    name: 'profile',
    initialState: null,
    reducers: {
  
    },
    extraReducers: builder => {
      builder.addCase(putOrganisationLogo.fulfilled, (state, action) => {
      })
    }
  })
  
  export default profileSlice.reducer
