// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import API from 'src/configs/apiEndpoints';
import { notificationTypes } from 'src/types/notification';

// ** Logout function
import { userLogout } from '../user';

interface Redux {
    getState: any
    dispatch: Dispatch<any>,
  }

export const load_Notifcation = createAsyncThunk('load/notification',
  async (_: void, { dispatch, getState }: Redux) => {
 
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .get(API.getNotification,
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
         } else if (err.response?.status === 401) {
           dispatch(userLogout())
         }
        }
    }
  })

const notificationSlice = createSlice({
    name: 'load_Notifcation',
    initialState: {
        title:  null,
        description:  null,
        order:  null,
        nextAction:  null,
    } as notificationTypes,
    reducers: {
  
    },
    extraReducers: builder => {
      builder.addCase(load_Notifcation.fulfilled, (state, action) => {
      })
    }
  })
  
export default notificationSlice.reducer
