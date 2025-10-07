import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const stopEncoding = createAsyncThunk(
  "auth/stopEncoding",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post(`/agent/stop-current-run`);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getExistingCampaigns = createAsyncThunk(
  "auth/getExistingCampaigns",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/campaign/get-all-campaigns`);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const startAgentEncoding = createAsyncThunk(
  "auth/startAgentEncoding",
  async ({ campaignId, opts, sheetName, delayMs }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post(`/agent/start-agent-encoding`, {
        campaignId,
        opts,
        sheetName,
        delayMs
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);




export const instantlyAiReducer = createSlice({
  name: "instantlyAi",
  initialState: {
    instantlyloader: false,
    encodingLoader: false,
    errorMessage: "",
    successMessage: "",
    existingCampaigns: [],
    totalExistingCampaigns: 0,
    navigateToLogs: false
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    navigateToLogsClear: (state, _) => {
      state.navigateToLogs = false;

    },
  },

  extraReducers: (builder) => {
    builder.addCase(getExistingCampaigns.pending, (state, _) => {
      state.instantlyloader = true;
    });
    builder.addCase(getExistingCampaigns.rejected, (state, payload) => {
      state.instantlyloader = false;
      state.errorMessage = payload.payload.error;
    });
    builder.addCase(getExistingCampaigns.fulfilled, (state, payload) => {
      state.instantlyloader = false;
      state.successMessage = payload.payload.message;
      state.existingCampaigns = payload.payload.campaigns;
      state.totalExistingCampaigns = payload.payload.total;
    });
    // encoding
    builder.addCase(startAgentEncoding.pending, (state, _) => {
      state.encodingLoader = true;
    });
    builder.addCase(startAgentEncoding.rejected, (state, payload) => {
      state.encodingLoader = false;
      state.errorMessage = payload.payload.error;
    });
    builder.addCase(startAgentEncoding.fulfilled, (state, payload) => {
      state.encodingLoader = false;
      state.successMessage = payload.payload.message;
      state.navigateToLogs = true;
    });

    //stop encoding
    builder.addCase(stopEncoding.pending, (state, _) => {
      state.encodingLoader = true;
    });
    builder.addCase(stopEncoding.rejected, (state, payload) => {
      state.encodingLoader = false;
      state.errorMessage = payload.payload.error;
    });
    builder.addCase(stopEncoding.fulfilled, (state, payload) => {
      state.encodingLoader = false;
      state.successMessage = payload.payload.message;
    });
  },
});

export const { messageClear, navigateToLogsClear } = instantlyAiReducer.actions;
export default instantlyAiReducer.reducer;
