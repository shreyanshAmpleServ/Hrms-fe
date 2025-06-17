import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/axiosConfig";

/**
 * Fetch employee by department from dashboard endpoint
 */
export const fetchEmployeeByDepartment = createAsyncThunk(
  "dashboard/fetchEmployeeByDepartment",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/dashboard/departments");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employee by department"
      );
    }
  }
);

const employeeByDepartmentSlice = createSlice({
  name: "employeeByDepartment",
  initialState: {
    employeeByDepartment: null,
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
      .addCase(fetchEmployeeByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeByDepartment = action.payload.data;
      })
      .addCase(fetchEmployeeByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = employeeByDepartmentSlice.actions;
export default employeeByDepartmentSlice.reducer;
