import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const stopEncoding = createAsyncThunk(
  "auth/stopEncoding",
  async ({ runId }, { fulfillWithValue, rejectWithValue }) => {
    console.log(`Stopping run ID: ${runId}`);

    try {
      const { data } = await api.post(`/agent/stop-current-run`, { runId });
      return fulfillWithValue(data);
    } catch (error) {
      console.error(
        "Stop encoding failed:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error" }
      );
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
  async (
    {
      opts,
      sheetName,
      sheetNameForPartnership,
      descriptionExtraction,
      autoAppend,
      clientId,
      sheetNameForSBA,
    },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await api.post(`/agent/start-agent-encoding`, {
        opts,
        sheetName,
        sheetNameForPartnership,
        descriptionExtraction,
        sheetNameForSBA,
        autoAppend,
        clientId,
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
    isEncodingDone: false,
    errorMessage: "",
    successMessage: "",
    existingCampaigns: [],
    totalExistingCampaigns: 0,
    navigateToLogs: false,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    navigateToLogsClear: (state, _) => {
      state.navigateToLogs = false;
    },
    resetEncodingState: (state, _) => {
      state.isEncodingDone = false;
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
      state.isEncodingDone = false;
    });
    builder.addCase(startAgentEncoding.rejected, (state, payload) => {
      state.encodingLoader = false;
      state.errorMessage = payload.payload.error;
      state.isEncodingDone = false;
    });
    builder.addCase(startAgentEncoding.fulfilled, (state, payload) => {
      state.encodingLoader = false;
      state.successMessage = payload.payload.message;
      state.navigateToLogs = true;
      state.isEncodingDone = true;
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

export const { messageClear, navigateToLogsClear, resetEncodingState } = instantlyAiReducer.actions;
export default instantlyAiReducer.reducer;
