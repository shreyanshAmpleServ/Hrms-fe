import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/axiosConfig";

/**
 * Fetch employee attendance count from dashboard endpoint
 */
export const fetchEmployeeAttendanceCount = createAsyncThunk(
  "dashboard/fetchEmployeeAttendanceCount",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/dashboard/employee-attendance");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employee attendance count"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    attendanceCount: null,
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
      .addCase(fetchEmployeeAttendanceCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAttendanceCount.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceCount = action.payload.data;
      })
      .addCase(fetchEmployeeAttendanceCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = dashboardSlice.actions;
export default dashboardSlice.reducer;
