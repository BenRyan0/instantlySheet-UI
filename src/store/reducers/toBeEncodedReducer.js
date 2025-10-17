import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getAllToBeEncoded = createAsyncThunk(
  "auth/getAllToBeEncoded",
  async (sheetID, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/tobeencoded-leads`);
      console.log("toBeEncoded data", data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const approveLeadEncodingLead = createAsyncThunk(
  "toBeEncoded/approveLeadEncodingLead",
  async ({ lead }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/lead/approve", { lead });

      console.log("data");
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Something went wrong" }
      );
    }
  }
);

export const denyLeadEncodingLead = createAsyncThunk(
  "toBeEncoded/denyLeadEncodingLead",
  async ({ id }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/lead/deny", { id });

      console.log("data");
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Something went wrong" }
      );
    }
  }
);

export const toBeEncodedReducer = createSlice({
  name: "toBeEncoded",
  initialState: {
    loader: false,
    encodingLoader: false,
    denyLoader: false,
    errorMessage: "",
    successMessage: "",
    // encodingError: false,
    encodingSuccess: false,
    denySuccess : false,
    toEncode: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    encodingSuccessClear: (state, _) => {
      state.encodingSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllToBeEncoded.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(getAllToBeEncoded.rejected, (state, payload) => {
      state.loader = false;
      state.errorMessage = payload.payload.error;
    });
    builder.addCase(getAllToBeEncoded.fulfilled, (state, payload) => {
      state.loader = false;
      state.successMessage = payload.payload.message;
      state.toEncode = payload.payload.toBeEncodedLeads;
    });

    builder.addCase(approveLeadEncodingLead.pending, (state, _) => {
      state.encodingLoader = true;
      state.encodingSuccess = false;
    });
    builder.addCase(approveLeadEncodingLead.rejected, (state, payload) => {
      state.encodingLoader = false;
      state.encodingSuccess = false;
      state.errorMessage = payload.payload.error;
    });
    builder.addCase(approveLeadEncodingLead.fulfilled, (state, payload) => {
      state.encodingLoader = false;
      state.encodingSuccess = true;
      state.successMessage = payload.payload.message;
      state.toEncode = payload.payload.toBeEncodedLeads;
    });


    builder.addCase(denyLeadEncodingLead.pending, (state, _) => {
      state.denyLoader = true;
      state.denySuccess = false;
    });
    builder.addCase(denyLeadEncodingLead.rejected, (state, payload) => {
      state.denyLoader = false;
      state.denySuccess = false;
      state.errorMessage = payload.payload.error;
    });
    builder.addCase(denyLeadEncodingLead.fulfilled, (state, payload) => {
      state.denyLoader = false;
      state.denySuccess = true;
      state.successMessage = payload.payload.message;
    });
  },
});

export const { messageClear, encodingSuccessClear } =
  toBeEncodedReducer.actions;
export default toBeEncodedReducer.reducer;
