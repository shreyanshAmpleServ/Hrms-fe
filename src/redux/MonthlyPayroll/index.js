import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";

/**
 * Fetch all monthly payroll with optional filters (search, date range, pagination).
 */
export const fetchMonthlyPayroll = createAsyncThunk(
  "monthlyPayroll/fetchMonthlyPayroll",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/monthly-payroll", {
        params,
      });
      return response.data; // Returns list of monthly payroll
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch monthly payroll"
      );
    }
  }
);

/**
 * Create a new monthly payroll.
 */
export const createMonthlyPayroll = createAsyncThunk(
  "monthlyPayroll/createMonthlyPayroll",
  async (monthlyPayrollData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/monthly-payroll", monthlyPayrollData),
        {
          loading: "Creating monthly payroll...",
          success: (res) =>
            res.data.message || "Monthly payroll created successfully!",
          error: "Failed to create monthly payroll",
        }
      );
      return response.data; // Returns the newly created monthly payroll
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create monthly payroll"
      );
    }
  }
);

/**
 * Update an existing monthly payroll by ID.
 */
export const updateMonthlyPayroll = createAsyncThunk(
  "monthlyPayroll/updateMonthlyPayroll",
  async ({ id, monthlyPayrollData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/monthly-payroll/${id}`, monthlyPayrollData),
        {
          loading: "Updating monthly payroll...",
          success: (res) =>
            res.data.message || "Monthly payroll updated successfully!",
          error: "Failed to update monthly payroll",
        }
      );
      return response.data; // Returns the updated monthly payroll
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Monthly payroll not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update monthly payroll"
      );
    }
  }
);

/**
 * Delete an monthly payroll by ID.
 */
export const deleteMonthlyPayroll = createAsyncThunk(
  "monthlyPayroll/deleteMonthlyPayroll",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/monthly-payroll/${id}`),
        {
          loading: "Deleting monthly payroll...",
          success: (res) =>
            res.data.message || "Monthly payroll deleted successfully!",
          error: "Failed to delete monthly payroll",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Monthly payroll deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete monthly payroll"
      );
    }
  }
);

/**
 * Fetch a single monthly payroll by ID.
 */
export const fetchMonthlyPayrollById = createAsyncThunk(
  "monthlyPayroll/fetchMonthlyPayrollById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/monthly-payroll/${id}`);
      return response.data; // Returns monthly payroll details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch monthly payroll"
      );
    }
  }
);

export const fetchMonthlyPayrollPreview = createAsyncThunk(
  "monthlyPayroll/fetchMonthlyPayrollPreview",
  async (params, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/monthly-payroll/run-sp", {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch monthly payroll preview"
      );
    }
  }
);

export const fetchComponentsFn = createAsyncThunk(
  "monthlyPayroll/fetchComponentsFn",
  async (params, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/components", {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch monthly payroll preview"
      );
    }
  }
);
export const fetchTaxAmountFn = async (params) => {
  try {
    const response = await apiClient.get("/v1/tax-calculation", {
      params,
    });
    return {
      tax_payee: Number(response.data?.data?.[0]?.TaxPayee) || 0,
      employee_id: params?.employee_id,
    };
  } catch (error) {
    throw error.response?.data;
  }
};

const monthlyPayrollSlice = createSlice({
  name: "monthlyPayroll",
  initialState: {
    monthlyPayroll: {},
    monthlyPayrollDetail: null,
    loading: false,
    error: null,
    success: null,
    monthlyPayrollPreview: null,
    componentNames: null,
    taxAmount: null,
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
      // Fetch all monthly payroll
      .addCase(fetchMonthlyPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyPayroll = action.payload.data;
      })
      .addCase(fetchMonthlyPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create monthly payroll
      .addCase(createMonthlyPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMonthlyPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyPayroll = {
          ...state.monthlyPayroll,
          data: [...(state.monthlyPayroll.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createMonthlyPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update monthly payroll
      .addCase(updateMonthlyPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMonthlyPayroll.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.monthlyPayroll.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.monthlyPayroll.data[index] = action.payload.data;
        } else {
          state.monthlyPayroll = {
            ...state.monthlyPayroll,
            data: [...(state.monthlyPayroll.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateMonthlyPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete monthly payroll
      .addCase(deleteMonthlyPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMonthlyPayroll.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.monthlyPayroll.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.monthlyPayroll = {
          ...state.monthlyPayroll,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteMonthlyPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch monthly payroll by ID
      .addCase(fetchMonthlyPayrollById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyPayrollById.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyPayrollDetail = action.payload.data;
      })
      .addCase(fetchMonthlyPayrollById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch monthly payroll preview
      .addCase(fetchMonthlyPayrollPreview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyPayrollPreview.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyPayrollPreview = action.payload.data;
      })
      .addCase(fetchMonthlyPayrollPreview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchComponentsFn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComponentsFn.fulfilled, (state, action) => {
        state.loading = false;
        state.componentNames = action.payload.data;
      })
      .addCase(fetchComponentsFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = monthlyPayrollSlice.actions;
export default monthlyPayrollSlice.reducer;
