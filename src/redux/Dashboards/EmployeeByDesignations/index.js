import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/axiosConfig";

/**
 * Fetch employee by designations from dashboard endpoint
 */
export const fetchEmployeeByDesignations = createAsyncThunk(
  "dashboard/fetchEmployeeByDesignations",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/dashboard/designations");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employee by designations"
      );
    }
  }
);

const employeeByDesignationsSlice = createSlice({
  name: "employeeByDesignations",
  initialState: {
    employeeByDesignations: null,
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
      .addCase(fetchEmployeeByDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeByDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeByDesignations = action.payload.data;
      })
      .addCase(fetchEmployeeByDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = employeeByDesignationsSlice.actions;
export default employeeByDesignationsSlice.reducer;
