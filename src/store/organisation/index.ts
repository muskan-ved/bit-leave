import { createAsyncThunk, createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { organisation } from "src/types/organisation";
import { show } from "../apiError";
import { userLogout } from "../user";
import API from "../../configs/apiEndpoints";
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}
export const loadOrganisation = createAsyncThunk('organisations/load',
  async (_params: void, { dispatch, getState }: Redux) => {

    const token = localStorage.getItem("accessToken");


    try {
      
      const result = await axios
         .get(API.loadOrganisation + "me", {
          headers: { 'Authorization': `Bearer ${token}` }
        })

      return result.data
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err?.response) {
       
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
    })
    builder.addCase(uploadCSVToS3.fulfilled, (state, action) => {
    })
  }
})

export default organisationSlice.reducer

