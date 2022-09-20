// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { OnboardingType } from 'src/types/onboarding'
import { show } from '../apiError'
import { updateOnBoarding, userLogout } from '../user'

// ** Config Var
import API from '../../configs/apiEndpoints'
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const postOrgOnboarding = createAsyncThunk('onboarding/org',

  async (params: OnboardingType, { dispatch, getState }: Redux) => {
    const token = localStorage.getItem("accessToken")

    try {
      const response = await axios
        .post(API.postOrgOnboarding,
          params,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      dispatch(updateOnBoarding(true))
      return response.data
    }
    catch(err){
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
         } else if (err.response?.status === 401) {
           dispatch(userLogout())
         }
        }
        else{
          var data = {
            canShow: true,
            redirect: true,
            code: '',
            message: '',
            location: '',
          }
          dispatch(show(data))
        }
    }
  })

export const xeroReturlUrl = createAsyncThunk('xero/returnUrl',
  async (_: void, { dispatch, getState }: Redux) => {
    try{
    const token = localStorage.getItem("accessToken");
   
    const result = await axios
      .get(API.xeroReturnUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    return result.data
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


  export const xeroConnectUrl = createAsyncThunk('xero/connectionUrl',
  async (_: void, { dispatch, getState }: Redux) => {
    try{
    const token = localStorage.getItem("accessToken");
  
    const result = await axios
      .get(`${API.xeroConnectionUrl}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    return result.data
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

const appOnboardingSlice = createSlice({
  name: 'appOnboarding',
  initialState: {
    compliance: '',
    leaveNotification: null,
    leaveWarning: null,
    maxPayout: null,
    email: '',
    payrollEmail: '',
    payrollLink: '',
    approval: '',
    signature: '',
    success: false,
    isLoading: false,
    onboardingDone: false
  },
  reducers: {
    orgonboardingComplete: (state, action) => {
      state.onboardingDone = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(postOrgOnboarding.fulfilled, (state, action) => {
      state.success = true;
      state.isLoading = false;
      state.onboardingDone = true;
    })
    builder.addCase(postOrgOnboarding.rejected, (state, action) => {
      state.success = false;
      state.isLoading = false;
    })
    builder.addCase(postOrgOnboarding.pending, (state, action) => {
      state.isLoading = true;
    })
    builder.addCase(xeroReturlUrl.fulfilled, (state, action) => {
    })
  }
})

export default appOnboardingSlice.reducer
