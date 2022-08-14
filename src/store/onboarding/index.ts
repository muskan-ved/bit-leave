// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { OnboardingType } from 'src/types/onboarding'
import { show } from '../apiError'
import { updateOnBoarding, userLogout } from '../user'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const postOrgOnboarding = createAsyncThunk('onboarding/org',

  async (params: OnboardingType, { dispatch, getState }: Redux) => {
    const token = localStorage.getItem("accessToken")

    try {
      const response = await axios
        .post('https://api.bitleave.co/organisations/onboarding',
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
      console.log(err)
      if (axios.isAxiosError(err)) {

        // console.log(err.response?.data)
        if (!err?.response) {
            console.log("No Server Response");
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
  }
})

export default appOnboardingSlice.reducer
