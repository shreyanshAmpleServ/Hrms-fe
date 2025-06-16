import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/axiosConfig";

/**
 * Fetch employee by designations from dashboard endpoint
 */
export const fetchEmployeeByStatus = createAsyncThunk(
  "dashboard/fetchEmployeeByStatus",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/dashboard/status");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employee by status"
      );
    }
  }
);

const employeeByStatusSlice = createSlice({
  name: "employeeByStatus",
  initialState: {
    employeeByStatus: null,
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
      .addCase(fetchEmployeeByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeByStatus = action.payload.data;
      })
      .addCase(fetchEmployeeByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = employeeByStatusSlice.actions;
export default employeeByStatusSlice.reducer;
