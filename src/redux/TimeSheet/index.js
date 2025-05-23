import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all employment contracts with optional filters (search, date range, pagination).
 */
export const fetchTimeSheet = createAsyncThunk(
  "timeSheet/fetchTimeSheet",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/time-sheet", {
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
export const createTimeSheet = createAsyncThunk(
  "timeSheet/createTimeSheet",
  async (timeSheetData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/time-sheet", timeSheetData),
        {
          loading: "Creating leave encashment...",
          success: (res) =>
            res.data.message || "Leave encashment created successfully!",
          error: "Failed to create leave encashment",
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
export const updateTimeSheet = createAsyncThunk(
  "timeSheet/updateTimeSheet",
  async ({ id, timeSheetData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/time-sheet/${id}`, timeSheetData),
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
export const deleteTimeSheet = createAsyncThunk(
  "timeSheet/deleteTimeSheet",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/time-sheet/${id}`),
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
export const fetchTimeSheetById = createAsyncThunk(
  "timeSheet/fetchTimeSheetById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/time-sheet/${id}`);
      return response.data; // Returns leave encashment details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leave encashment"
      );
    }
  }
);

const timeSheetSlice = createSlice({
  name: "timeSheet",
  initialState: {
    timeSheet: {},
    timeSheetDetail: null, // Can be renamed to 'contractDetail' for clarity
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
      .addCase(fetchTimeSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSheet = action.payload.data;
      })
      .addCase(fetchTimeSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create employment contract
      .addCase(createTimeSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTimeSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSheet = {
          ...state.timeSheet,
          data: [...(state.timeSheet.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createTimeSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update employment contract
      .addCase(updateTimeSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTimeSheet.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.timeSheet.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.timeSheet.data[index] = action.payload.data;
        } else {
          state.timeSheet = {
            ...state.timeSheet,
            data: [...(state.timeSheet.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateTimeSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete employment contract
      .addCase(deleteTimeSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTimeSheet.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.timeSheet.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.timeSheet = { ...state.timeSheet, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deleteTimeSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch employment contract by ID
      .addCase(fetchTimeSheetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSheetById.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSheetDetail = action.payload.data; // Consider renaming to contractDetail
      })
      .addCase(fetchTimeSheetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = timeSheetSlice.actions;
export default timeSheetSlice.reducer;
