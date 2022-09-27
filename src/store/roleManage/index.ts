// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import API from 'src/configs/apiEndpoints';
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
         } else if (err.response?.status === 401) {
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
