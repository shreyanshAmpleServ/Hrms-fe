import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Async thunk to fetch AttendaceSummarys with filters
export const fetchAttendaceSummary = createAsyncThunk(
  "AttendaceSummarys/fetchAttendaceSummary",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/daily-attendaceSummary", {
        params: {
          search: datas?.search || "",
          page: datas?.page || "",
          size: datas?.size || "",
          startDate: datas?.startDate || "",
          endDate: datas?.endDate || "",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch file AttendaceSummary"
      );
    }
  }
);

// Initial state
const initialState = {
  AttendaceSummarys: [],
  loading: false,
  error: null,
};

// Slice
const AttendaceSummarySlice = createSlice({
  name: "AttendaceSummarys",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendaceSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendaceSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.AttendaceSummarys = action.payload.data;
      })
      .addCase(fetchAttendaceSummary.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.payload ||
          "Something went wrong while fetching AttendaceSummarys";
      });
  },
});

export default AttendaceSummarySlice.reducer;
