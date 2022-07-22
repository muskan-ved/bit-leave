import { createSlice } from "@reduxjs/toolkit";

const apiErrorSlice = createSlice({
  name: 'error',
  initialState: {
    code: '',
    message: '',
    redirect: false,
    location: '',
    canShow: false
  },
  reducers: {
    show: (state, action) => {
      state.message = action.payload.message
      state.redirect=false
      state.canShow =true
    },
    hide: (state, action) => {
      state.canShow = false
      state.message=action.payload.message
    }
  }
})

export const { show, hide } = apiErrorSlice.actions
export default apiErrorSlice.reducer
