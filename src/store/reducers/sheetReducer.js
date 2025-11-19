import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getExistingSheets = createAsyncThunk(
  "auth/getExistingSheets",
  async (sheetID, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/sheets/${sheetID}`);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const AddNewSheet = createAsyncThunk(
  "auth/AddNewSheet",
  async (
    { sheetID, columns, sheetName },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await api.post(`/sheets/${sheetID}/addSheet`, {
        sheetName,
        columns,
      });
      console.log("data -------------------------------------------");
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const GetSheetData = createAsyncThunk(
  "auth/GetSheetData",
  async (
    { sheetNames, spreadsheetId },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await api.post(
        "/sheets/get-row-count",
        {
          sheetNames, // body
        },
        {
          params: { spreadsheetId }, // query params
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const sheetReducer = createSlice({
  name: "sheet",
  initialState: {
    loader: false,
    sheetStatsLoader: false,
    errorMessage: "",
    successMessage: "",
    existingSheets: [],
    sheetStats: []
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getExistingSheets.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(getExistingSheets.rejected, (state, payload) => {
      state.loader = false;
      state.errorMessage = payload.payload.error;
    });
    builder.addCase(getExistingSheets.fulfilled, (state, payload) => {
      state.loader = false;
      state.successMessage = payload.payload.message;
      state.existingSheets = payload.payload.sheets;
    });

    //   AddNewSheet
    builder.addCase(AddNewSheet.pending, (state, _) => {
      state.loader = true;
    });
    builder.addCase(AddNewSheet.rejected, (state, payload) => {
      state.loader = false;
      console.log(payload.payload.error);
      console.log("payload.payload.error-------------------");
      state.errorMessage = payload.payload.error;
    });
    builder.addCase(AddNewSheet.fulfilled, (state, payload) => {
      state.loader = false;
      state.successMessage = payload.payload.message;
      state.existingSheets.push(payload.payload.sheetName);
    });


    builder.addCase(GetSheetData.pending, (state, _) => {
      state.sheetStatsLoader = true;
    });
    builder.addCase(GetSheetData.rejected, (state, payload) => {
      state.sheetStatsLoader = false;
      state.errorMessage = payload.payload.error;
    });
    builder.addCase(GetSheetData.fulfilled, (state, payload) => {
      state.sheetStatsLoader = false;
      // state.successMessage = payload.payload.message;
      state.sheetStats = payload.payload;
      
    });
  },
});

export const { messageClear } = sheetReducer.actions;
export default sheetReducer.reducer;
