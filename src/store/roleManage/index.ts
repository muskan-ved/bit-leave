// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** API Import
import API from 'src/configs/apiEndpoints';

// ** Types Import
import { roles } from 'src/types/roleManage';

// ** Logout function
import { userLogout } from '../user';

interface Redux {
    getState: any
    dispatch: Dispatch<any>,
  }  

export const roleManagement = createAsyncThunk('role/manage',
  async (_:void, { dispatch, getState }: Redux) => {
 
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .get(API.roleManage,
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

  export const roleUpdate = createAsyncThunk('role/update',
  async (params: any, { dispatch, getState }: Redux) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios
        .patch(API.roleUpdate,
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

const roleManagementSlice = createSlice({
    name: 'roleManage',
    initialState: {
        fullName:  null,
        role:  null,
    } as roles,
    reducers: {
  
    },
    extraReducers: builder => {
      builder.addCase(roleManagement.fulfilled, (state, action) => {
      })
    }
  })
  
export default roleManagementSlice.reducer
