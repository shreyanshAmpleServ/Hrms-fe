import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all time sheet with optional filters (search, date range, pagination).
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
      return response.data; // Returns list of time sheet entry
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch time sheet entry"
      );
    }
  }
);

/**
 * Create a new time sheet.
 */
export const createTimeSheet = createAsyncThunk(
  "timeSheet/createTimeSheet",
  async (timeSheetData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/time-sheet", timeSheetData),
        {
          loading: "Creating time sheet entry...",
          success: (res) =>
            res.data.message || "Time sheet entry created successfully!",
          error: "Failed to create time sheet entry",
        }
      );
      return response.data; // Returns the newly created time sheet entry
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create time sheet entry"
      );
    }
  }
);

/**
 * Update an existing time sheet by ID.
 */
export const updateTimeSheet = createAsyncThunk(
  "timeSheet/updateTimeSheet",
  async ({ id, timeSheetData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/time-sheet/${id}`, timeSheetData),
        {
          loading: "Updating time sheet entry...",
          success: (res) =>
            res.data.message || "Time sheet entry updated successfully!",
          error: "Failed to update time sheet entry",
        }
      );
      return response.data; // Returns the updated time sheet entry
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Time sheet entry not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update time sheet entry"
      );
    }
  }
);

/**
 * Delete an time sheet by ID.
 */
export const deleteTimeSheet = createAsyncThunk(
  "timeSheet/deleteTimeSheet",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/time-sheet/${id}`),
        {
          loading: "Deleting time sheet entry...",
          success: (res) =>
            res.data.message || "Time sheet entry deleted  successfully!",
          error: "Failed to delete time sheet entry",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Time sheet entry deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete time sheet entry"
      );
    }
  }
);

/**
 * Fetch a single time sheet by ID.
 */
export const fetchTimeSheetById = createAsyncThunk(
  "timeSheet/fetchTimeSheetById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/time-sheet/${id}`);
      return response.data; // Returns time sheet entry details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch time sheet entry"
      );
    }
  }
);

const timeSheetSlice = createSlice({
  name: "timeSheet",
  initialState: {
    timeSheet: {},
    timeSheetDetail: null,
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
      // Fetch all time sheet
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

      // Create time sheet
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

      // Update time sheet
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

      // Delete time sheet
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

      // Fetch time sheet by ID
      .addCase(fetchTimeSheetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeSheetById.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSheetDetail = action.payload.data; // Consider renaming to timeSheetDetail
      })
      .addCase(fetchTimeSheetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = timeSheetSlice.actions;
export default timeSheetSlice.reducer;
