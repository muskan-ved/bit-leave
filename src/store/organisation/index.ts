import { createAsyncThunk, createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { organisation } from "src/types/organisation";
import { show } from "../apiError";


interface Redux {
  getState: any
  dispatch: Dispatch<any>,

}
export const loadOrganisation = createAsyncThunk('organisations/load',
  async (_params: void, { dispatch, getState }: Redux) => {
    const token = localStorage.getItem("accessToken");
    try {
      const result = await axios
        .get('https://api.bitleave.co/organisations/1', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

      return result.data
    }
    catch (e) {
      console.log(e);
      var data = {
        canShow: true,
        redirect: false,
        code: '',
        message: 'Error occured while processing the request ',
        location: '',
      }
      dispatch(show(data))
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
      const payload = action.payload.data
      state.id = payload.organisation.id
      state.active = payload.organisation.active
      state.exit_date = payload.organisation.exit_date
      state.name = payload.organisation.name
      state.onboard_date = payload.organisation.onboard_date
    })
  }
})

export default organisationSlice.reducer

