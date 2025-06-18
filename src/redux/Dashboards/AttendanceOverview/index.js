import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/axiosConfig";

/**
 * Fetch attendance overview from dashboard endpoint
 */
export const fetchAttendanceOverview = createAsyncThunk(
  "dashboard/fetchAttendanceOverview",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/dashboard/attendance-overview");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch attendance overview"
      );
    }
  }
);

const attendanceOverviewSlice = createSlice({
  name: "attendanceOverview",
  initialState: {
    attendanceOverview: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceOverview = action.payload.data;
      })
      .addCase(fetchAttendanceOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = attendanceOverviewSlice.actions;
export default attendanceOverviewSlice.reducer;
