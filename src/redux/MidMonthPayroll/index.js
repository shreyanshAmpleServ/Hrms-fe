import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all advance payment with optional filters (search, date range, pagination).
 */
export const fetchMidMonthPayroll = createAsyncThunk(
  "midMonthPayroll/fetchMidMonthPayroll",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/midmonth-payroll-processing", {
        params,
      });
      return response.data; // Returns list of mid month payroll
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch mid month payroll"
      );
    }
  }
);

/**
 * Create a new advance payment.
 */
export const createMidMonthPayroll = createAsyncThunk(
  "midMonthPayroll/createMidMonthPayroll",
  async (midMonthPayrollData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/midmonth-payroll-processing", midMonthPayrollData),
        {
          loading: "Creating mid month payroll...",
          success: (res) =>
            res.data.message || "Mid month payroll created successfully!",
          error: "Failed to create mid month payroll",
        }
      );
      return response.data; // Returns the newly created mid month payroll
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create mid month payroll"
      );
    }
  }
);

/**
 * Update an existing advance payment by ID.
 */
export const updateMidMonthPayroll = createAsyncThunk(
  "midMonthPayroll/updateMidMonthPayroll",
  async ({ id, midMonthPayrollData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(
          `/v1/midmonth-payroll-processing/${id}`,
          midMonthPayrollData
        ),
        {
          loading: "Updating mid month payroll...",
          success: (res) =>
            res.data.message || "Mid month payroll updated successfully!",
          error: "Failed to update mid month payroll",
        }
      );
      return response.data; // Returns the updated mid month payroll
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Mid month payroll not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update mid month payroll"
      );
    }
  }
);

/**
 * Delete an advance payment by ID.
 */
export const deleteMidMonthPayroll = createAsyncThunk(
  "midMonthPayroll/deleteMidMonthPayroll",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/midmonth-payroll-processing/${id}`),
        {
          loading: "Deleting mid month payroll...",
          success: (res) =>
            res.data.message || "Mid month payroll deleted successfully!",
          error: "Failed to delete mid month payroll",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Mid month payroll deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete mid month payroll"
      );
    }
  }
);

/**
 * Fetch a single advance payment by ID.
 */
export const fetchMidMonthPayrollById = createAsyncThunk(
  "midMonthPayroll/fetchMidMonthPayrollById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(
        `/v1/midmonth-payroll-processing/${id}`
      );
      return response.data; // Returns mid month payroll details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch mid month payroll"
      );
    }
  }
);

const midMonthPayrollSlice = createSlice({
  name: "midMonthPayroll",
  initialState: {
    midMonthPayroll: {},
    midMonthPayrollDetail: null,
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
      // Fetch all mid month payroll
      .addCase(fetchMidMonthPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMidMonthPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.midMonthPayroll = action.payload.data;
      })
      .addCase(fetchMidMonthPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create mid month payroll
      .addCase(createMidMonthPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMidMonthPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.midMonthPayroll = {
          ...state.midMonthPayroll,
          data: [...(state.midMonthPayroll.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createMidMonthPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update mid month payroll
      .addCase(updateMidMonthPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMidMonthPayroll.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.midMonthPayroll.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.midMonthPayroll.data[index] = action.payload.data;
        } else {
          state.midMonthPayroll = {
            ...state.midMonthPayroll,
            data: [...(state.midMonthPayroll.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateMidMonthPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete mid month payroll
      .addCase(deleteMidMonthPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMidMonthPayroll.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.midMonthPayroll.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.midMonthPayroll = {
          ...state.midMonthPayroll,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteMidMonthPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch mid month payroll by ID
      .addCase(fetchMidMonthPayrollById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMidMonthPayrollById.fulfilled, (state, action) => {
        state.loading = false;
        state.midMonthPayrollDetail = action.payload.data;
      })
      .addCase(fetchMidMonthPayrollById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = midMonthPayrollSlice.actions;
export default midMonthPayrollSlice.reducer;
