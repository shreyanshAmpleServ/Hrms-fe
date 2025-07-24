import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all employment contracts with optional filters (search, date range, pagination).
 */
export const fetchLeaveEncashment = createAsyncThunk(
  "leaveEncashment/fetchLeaveEncashment",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/leave-encashment", {
        params,
      });
      return response.data; // Returns list of leave encashment
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leave encashment"
      );
    }
  }
);

/**
 * Create a new employment contract.
 */
export const createLeaveEncashment = createAsyncThunk(
  "leaveEncashment/createLeaveEncashment",
  async (leaveEncashmentData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/leave-encashment", leaveEncashmentData),
        {
          loading: "Creating leave encashment...",
          success: (res) =>
            res.data.message || "Leave encashment created successfully!",
          error: (error) =>
            error.response?.data.message || "Failed to create leave encashment",
        }
      );
      return response.data; // Returns the newly created leave encashment
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create leave encashment"
      );
    }
  }
);

/**
 * Update an existing employment contract by ID.
 */
export const updateLeaveEncashment = createAsyncThunk(
  "leaveEncashment/updateLeaveEncashment",
  async ({ id, leaveEncashmentData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/leave-encashment/${id}`, leaveEncashmentData),
        {
          loading: "Updating leave encashment...",
          success: (res) =>
            res.data.message || "Leave encashment updated successfully!",
          error: "Failed to update leave encashment",
        }
      );
      return response.data; // Returns the updated leave encashment
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Leave encashment not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update leave encashment"
      );
    }
  }
);

/**
 * Delete an employment contract by ID.
 */
export const deleteLeaveEncashment = createAsyncThunk(
  "leaveEncashment/deleteLeaveEncashment",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/leave-encashment/${id}`),
        {
          loading: "Deleting leave encashment...",
          success: (res) =>
            res.data.message || "Leave encashment deleted successfully!",
          error: "Failed to delete leave encashment",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Leave encashment deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete leave encashment"
      );
    }
  }
);

/**
 * Fetch a single leave encashment by ID.
 */
export const fetchLeaveEncashmentById = createAsyncThunk(
  "leaveEncashment/fetchLeaveEncashmentById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/leave-encashment/${id}`);
      return response.data; // Returns leave encashment details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leave encashment"
      );
    }
  }
);

const leaveEncashmentSlice = createSlice({
  name: "leaveEncashment",
  initialState: {
    leaveEncashment: {},
    leaveEncashmentDetail: null, // Can be renamed to 'contractDetail' for clarity
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
      // Fetch all employment contracts
      .addCase(fetchLeaveEncashment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveEncashment.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveEncashment = action.payload.data;
      })
      .addCase(fetchLeaveEncashment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create employment contract
      .addCase(createLeaveEncashment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeaveEncashment.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveEncashment = {
          ...state.leaveEncashment,
          data: [...(state.leaveEncashment.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createLeaveEncashment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update employment contract
      .addCase(updateLeaveEncashment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveEncashment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leaveEncashment.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.leaveEncashment.data[index] = action.payload.data;
        } else {
          state.leaveEncashment = {
            ...state.leaveEncashment,
            data: [...(state.leaveEncashment.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateLeaveEncashment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete employment contract
      .addCase(deleteLeaveEncashment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeaveEncashment.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.leaveEncashment.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.leaveEncashment = { ...state.leaveEncashment, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deleteLeaveEncashment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch employment contract by ID
      .addCase(fetchLeaveEncashmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveEncashmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveEncashmentDetail = action.payload.data; // Consider renaming to contractDetail
      })
      .addCase(fetchLeaveEncashmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = leaveEncashmentSlice.actions;
export default leaveEncashmentSlice.reducer;
