import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getAllLogs = createAsyncThunk(
  "auth/getAllLogs",
  async ({ startDate, endDate }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/log/get-all-logs`, {
        params: { startDate, endDate }
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);




export const logsReducer = createSlice({
  name: "sheet",
  initialState: {
    loader: false,
    errorMessage: "",
    successMessage: "",
    encodingClassification : [],
    logs: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllLogs.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(getAllLogs.rejected, (state, payload) => {
      state.loader = false;
      state.errorMessage = payload.payload.error;
    });
    builder.addCase(getAllLogs.fulfilled, (state, payload) => {
      state.loader = false;
      state.successMessage = payload.payload.message;
      state.logs = payload.payload.logs;
      state.encodingClassification = payload.payload.encodingClassification;
    });

  
  },
});

export const { messageClear } = logsReducer.actions;
export default logsReducer.reducer;
