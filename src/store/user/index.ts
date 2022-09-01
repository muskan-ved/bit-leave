// ** Redux Imports
import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

export const userLogout = createAsyncThunk('user/logout',
  async (_params: void, { dispatch, getState }: Redux) => {
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('accessToken')
    window.localStorage.clear()
    dispatch({ type: 'store/reset' })
  })

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
    cognitoUser: null
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
      state.username = action.payload.username
      state.cognitoUser = action.payload.cognitoUser
    },
    updateOnBoarding: (state, action) => {
      state.userOnboarded = action.payload
    },
    getUser: (state, action) => {
      let data = Object.assign({}, state)
      return data
    },
  },
  extraReducers: builder => {
    builder.addCase(userLogout.fulfilled, (state, action) => {
      document.location.href = '/login'
    })
  }
})

export const {
  refreshUserState,
  getUser,
  updateOnBoarding
} = userSlice.actions;
export default userSlice.reducer
