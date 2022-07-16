// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { OnboardingType } from 'src/types/onboarding'
import { show } from '../apiError'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const postOrgOnboarding = createAsyncThunk('onboarding/org',

  async (params: OnboardingType, { dispatch, getState }: Redux) => {
    console.log(params);
    const token = localStorage.getItem("accessToken")
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    debugger;
    try {
      const response = await axios
        .post('http://localhost:3002/onboarding',
          params,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

      return response.data
    }
    catch (err) {
      var data = {
        canShow: true,
        redirect: true,
        code: '',
        message: '',
        location: '',
      }
      dispatch(show(data))
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
    isLoading: false
  },
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(postOrgOnboarding.fulfilled, (state, action) => {
      console.log(state, action);
      state.success = true;
      state.isLoading = false;
    })
    builder.addCase(postOrgOnboarding.rejected, (state, action) => {
      console.log(state, action);
      state.success = false;
      state.isLoading = false;


    })
    builder.addCase(postOrgOnboarding.pending, (state, action) => {
      console.log(state, action);
      state.isLoading = true;
    })
  }

})

export default appOnboardingSlice.reducer
