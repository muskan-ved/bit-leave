// ** Redux Imports
import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
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
        .get('https://api.bitleave.co/employeeactions/' + id,
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
            console.log("No Server Response");
         } else if (err.response?.status === 401) {
           dispatch(userLogout())
         }
        }
    }
  })