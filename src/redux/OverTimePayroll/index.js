import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all overtime payroll with optional filters (search, date range, pagination).
 */
export const fetchOverTimePayroll = createAsyncThunk(
  "overtimePayroll/fetchOverTimePayroll",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/overtime-payroll-processing", {
        params,
      });
      return response.data; // Returns list of overtime payroll
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch overtime payroll"
      );
    }
  }
);

/**
 * Create a new overtime payroll.
 */
export const createOverTimePayroll = createAsyncThunk(
  "overtimePayroll/createOverTimePayroll",
  async (overtimePayrollData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/overtime-payroll-processing", overtimePayrollData),
        {
          loading: "Creating overtime payroll...",
          success: (res) =>
            res.data.message || "Overtime payroll created successfully!",
          error: "Failed to create overtime payroll",
        }
      );
      return response.data; // Returns the newly created overtime payroll
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create overtime payroll"
      );
    }
  }
);

/**
 * Update an existing overtime payroll by ID.
 */
export const updateOverTimePayroll = createAsyncThunk(
  "overtimePayroll/updateOverTimePayroll",
  async ({ id, overtimePayrollData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(
          `/v1/overtime-payroll-processing/${id}`,
          overtimePayrollData
        ),
        {
          loading: "Updating overtime payroll...",
          success: (res) =>
            res.data.message || "Overtime payroll updated successfully!",
          error: "Failed to update overtime payroll",
        }
      );
      return response.data; // Returns the updated overtime payroll
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Overtime payroll not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update overtime payroll"
      );
    }
  }
);

/**
 * Delete an overtime payroll by ID.
 */
export const deleteOverTimePayroll = createAsyncThunk(
  "overtimePayroll/deleteOverTimePayroll",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/overtime-payroll-processing/${id}`),
        {
          loading: "Deleting overtime payroll...",
          success: (res) =>
            res.data.message || "Overtime payroll deleted successfully!",
          error: "Failed to delete overtime payroll",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Overtime payroll deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete overtime payroll"
      );
    }
  }
);

/**
 * Fetch a single overtime payroll by ID.
 */
export const fetchOverTimePayrollById = createAsyncThunk(
  "overtimePayroll/fetchOverTimePayrollById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(
        `/v1/overtime-payroll-processing/${id}`
      );
      return response.data; // Returns overtime payroll details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch overtime payroll"
      );
    }
  }
);

const overtimePayrollSlice = createSlice({
  name: "overtimePayroll",
  initialState: {
    overtimePayroll: {},
    overtimePayrollDetail: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    // Clear success and error messages
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all overtime payroll
      .addCase(fetchOverTimePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverTimePayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.overtimePayroll = action.payload.data;
      })
      .addCase(fetchOverTimePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create overtime payroll
      .addCase(createOverTimePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOverTimePayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.overtimePayroll = {
          ...state.overtimePayroll,
          data: [...(state.overtimePayroll.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createOverTimePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update overtime payroll
      .addCase(updateOverTimePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOverTimePayroll.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.overtimePayroll.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.overtimePayroll.data[index] = action.payload.data;
        } else {
          state.overtimePayroll = {
            ...state.overtimePayroll,
            data: [...(state.overtimePayroll.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateOverTimePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete overtime payroll
      .addCase(deleteOverTimePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOverTimePayroll.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.overtimePayroll.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.overtimePayroll = {
          ...state.overtimePayroll,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteOverTimePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch overtime payroll by ID
      .addCase(fetchOverTimePayrollById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverTimePayrollById.fulfilled, (state, action) => {
        state.loading = false;
        state.overtimePayrollDetail = action.payload.data;
      })
      .addCase(fetchOverTimePayrollById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = overtimePayrollSlice.actions;
export default overtimePayrollSlice.reducer;
