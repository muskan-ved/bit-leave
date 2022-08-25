import { createAsyncThunk, createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { organisation } from "src/types/organisation";
import { show } from "../apiError";
import { userLogout } from "../user";
import API from "../../configs/auth";
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}
export const loadOrganisation = createAsyncThunk('organisations/load',
  async (_params: void, { dispatch, getState }: Redux) => {

    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData")
    var organisationId;
    if (userData != null) {
      organisationId = JSON.parse(userData)
    }
    const orgvarId = getState().user.orgId
    const empId = orgvarId !== null? orgvarId : organisationId.orgId;

    try {
      
      const result = await axios
         .get(API.loadOrganisation + empId, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

      return result.data
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
          console.log("No Server Response");
        } else if (err.response?.status === 401) {
          dispatch(userLogout())
        }
      }
      else {
        var data = {
          canShow: true,
          redirect: false,
          code: '',
          message: 'Error occured while processing the request ',
          location: '',
        }
        dispatch(show(data))
      }
    }
  })

  export const uploadCSVToS3 = createAsyncThunk('organisations/uploads3',
  async (params: any, { dispatch, getState }: Redux) => {
    const token = localStorage.getItem("accessToken");
    try {
      const result = await axios
        .post(API.uploadCSVToS3,params, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      return result.data
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
          console.log("No Server Response");
        } else if (err.response?.status === 401) {
          dispatch(userLogout())
        }
      }
    }
  })

const organisationSlice = createSlice({
  name: 'organisation',
  initialState: {
    id: null,
    name: null,
    onboard_date: null,
    active: false,
    exit_date: null,
  } as organisation,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(loadOrganisation.fulfilled, (state, action) => {
      if (action.payload) {
        // const payload = action.payload.data
        // state.id = payload.organisation.id
        // state.active = payload.organisation.active
        // state.exit_date = payload.organisation.exit_date
        // state.name = payload.organisation.name
        // state.onboard_date = payload.organisation.onboard_date
      }
    })

    builder.addCase(uploadCSVToS3.fulfilled, (state, action) => {
     
    })
  }
})

export default organisationSlice.reducer

