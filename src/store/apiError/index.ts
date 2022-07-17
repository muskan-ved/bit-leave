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
      state.message = 'this is a message'
      state.redirect=true
    },
    hide: (state, action) => {
      state.canShow = false
    }
  }
})

export const { show, hide } = apiErrorSlice.actions
export default apiErrorSlice.reducer
