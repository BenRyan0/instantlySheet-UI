import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getAllToBeEncoded = createAsyncThunk(
  "auth/getAllToBeEncoded",
  async (sheetID, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/tobeencoded-leads`);
      console.log("toBeEncoded data",data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



export const toBeEncodedReducer = createSlice({
  name: "toBeEncoded",
  initialState: {
    loader: false,
    errorMessage: "",
    successMessage: "",
    toEncode: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },

  extraReducers: (builder) => {
    // builder.addCase(getAllLogs.pending, (state, _) => {
    //   state.loader = true;
    // });
    // builder.addCase(getAllLogs.rejected, (state, payload) => {
    //   state.loader = false;
    //   state.errorMessage = payload.payload.error;
    // });
    builder.addCase(getAllToBeEncoded.fulfilled, (state, payload) => {
      state.loader = true;
      state.successMessage = payload.payload.message;
      state.toEncode = payload.payload.toBeEncodedLeads;
    });

  
  },
});

export const { messageClear } = toBeEncodedReducer.actions;
export default toBeEncodedReducer.reducer;
