// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { user } from 'src/types/user'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}
const intialState: user = {
  avatar: '',
  companyname: '',
  email: '',
  fullName: '',
  id: null,
  orgId: null,
  role: '',
  userOnboarded: false,
  username: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    avatar: '',
    companyname: '',
    email: '',
    fullName: '',
    id: null,
    orgId: null,
    role: '',
    userOnboarded: false,
    username: '',
  },
  reducers: {
    refreshUserState: (state, action) => {
      state.avatar = action.payload.avatar
      state.companyname = action.payload.companyname
      state.email = action.payload.email
      state.fullName = action.payload.fullName
      state.id = action.payload.id
      state.orgId = action.payload.orgId
      state.role = action.payload.role
      state.userOnboarded = action.payload.userOnboarded
      state.username = action.payload.username
    }
  }

})

export const {
  refreshUserState
} = userSlice.actions;
export default userSlice.reducer
