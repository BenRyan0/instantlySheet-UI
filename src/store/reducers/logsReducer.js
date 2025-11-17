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
export const getDailyLog = createAsyncThunk(
  "auth/getDailyLog",
  async ({date }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/log/get-daily-logs`, {
        params: { date }
      });

      console.log("data ------")
      console.log(data)

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getAllLogsTable = createAsyncThunk(
  "auth/getAllLogsTable",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/log/get-all-logs-table`);
      console.log("Logs Table Data:", data)

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
    logsTable: [],
    dailyLog: [],
    dailyLogLoader:false
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



    builder.addCase(getAllLogsTable.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(getAllLogsTable.rejected, (state, payload) => {
      state.loader = false;
      // state.errorMessage = payload.payload.error;
    });
    builder.addCase(getAllLogsTable.fulfilled, (state, payload) => {
      state.loader = false;
      state.successMessage = payload.payload.message;
      state.logsTable = payload.payload.logs;
    });

    builder.addCase(getDailyLog.pending, (state, _) => {
      state.dailyLogLoader = true;
    });
    builder.addCase(getDailyLog.rejected, (state, payload) => {
      state.dailyLogLoader = false;
      // state.errorMessage = payload.payload.error;
    });
    builder.addCase(getDailyLog.fulfilled, (state, payload) => {
      state.dailyLogLoader = false;
      state.successMessage = payload.payload.message;
      state.dailyLog = payload.payload.perDate;
      state.totalLog = [payload.payload.totalByCategory];
    });

  
  },
});

export const { messageClear } = logsReducer.actions;
export default logsReducer.reducer;
