// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { FormatLetterCaseLower } from 'mdi-material-ui'
import { OnboardingType } from 'src/types/onboarding'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const postOrgOnboarding = createAsyncThunk('onboarding/org',

  async (params: OnboardingType, { dispatch, getState }: Redux) => {
    debugger;
    console.log(params);
    const token = localStorage.getItem("accessToken")

    const response = await axios
      .post('https://api.bitleave.co/organisations', {
        headers: { 'Authorization': `Bearer ${token}` },
        data: params
      });

    return response.data
  })

export const postEmpOnboarding = createAsyncThunk('onboarding/emp',

  async (params: OnboardingType, { dispatch, getState }: Redux) => {
    return 'OK'
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
