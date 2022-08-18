// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { actionApproval } from 'src/types/actionApproval';

// ** Logout function
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

const actionApprovalSlice = createSlice({
    name: 'actionApproval',
    initialState: {
        cashoutamt:  null,
        actiondate:  null,
        approvalreason:  null,
        rejectreason:  null,
        cashoutreason:  null,
        signatureOfEmployee:  null,
        submitApproval:  null,
    } as actionApproval,
    reducers: {
  
    },
    extraReducers: builder => {
      builder.addCase(cashoutActionApproval.fulfilled, (state, action) => {
      })
    }
  })
  
export default actionApprovalSlice.reducer
