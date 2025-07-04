import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all work life event log with optional filters (search, date range, pagination).
 */
export const fetchWorkLifeEventLog = createAsyncThunk(
  "workLifeEventLog/fetchWorkLifeEventLog",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.startDate) params.startDate = datas?.startDate?.toISOString();
      if (datas?.endDate) params.endDate = datas?.endDate?.toISOString();
      if (datas?.is_active) params.is_active = datas?.is_active;

      const response = await apiClient.get("/v1/work-life-event-log", {
        params,
      });
      return response.data; // Returns list of work life event log
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch work life event log"
      );
    }
  }
);

/**
 * Create a new work life event log.
 */
export const createWorkLifeEventLog = createAsyncThunk(
  "workLifeEventLog/createWorkLifeEventLog",
  async (workLifeEventLogData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/work-life-event-log", workLifeEventLogData),
        {
          loading: "Creating work life event log...",
          success: (res) =>
            res.data.message || "Work life event log created successfully!",
          error: "Failed to create work life event log",
        }
      );
      return response.data; // Returns the newly created work life event log
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create work life event log"
      );
    }
  }
);

/**
 * Update an existing work life event log by ID.
 */
export const updateWorkLifeEventLog = createAsyncThunk(
  "workLifeEventLog/updateWorkLifeEventLog",
  async ({ id, workLifeEventLogData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/work-life-event-log/${id}`, workLifeEventLogData),
        {
          loading: "Updating work life event log...",
          success: (res) =>
            res.data.message || "Work life event log updated successfully!",
          error: "Failed to update work life event log",
        }
      );
      return response.data; // Returns the updated work life event log
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Work life event log not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update work life event log"
      );
    }
  }
);

/**
 * Delete an employment contract by ID.
 */
export const deleteWorkLifeEventLog = createAsyncThunk(
  "workLifeEventLog/deleteWorkLifeEventLog",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/work-life-event-log/${id}`),
        {
          loading: "Deleting work life event log...",
          success: (res) =>
            res.data.message || "Work life event log deleted successfully!",
          error: "Failed to delete work life event log",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Work life event log deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete work life event log"
      );
    }
  }
);

/**
 * Fetch a single leave encashment by ID.
 */
export const fetchWorkLifeEventLogById = createAsyncThunk(
  "workLifeEventLog/fetchWorkLifeEventLogById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/work-life-event-log/${id}`);
      return response.data; // Returns work life event log details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch work life event log"
      );
    }
  }
);

const workLifeEventLogSlice = createSlice({
  name: "workLifeEventLog",
  initialState: {
    workLifeEventLog: {},
    workLifeEventLogDetail: null, // Can be renamed to 'contractDetail' for clarity
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
      .addCase(fetchWorkLifeEventLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkLifeEventLog.fulfilled, (state, action) => {
        state.loading = false;
        state.workLifeEventLog = action.payload.data;
      })
      .addCase(fetchWorkLifeEventLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create employment contract
      .addCase(createWorkLifeEventLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkLifeEventLog.fulfilled, (state, action) => {
        state.loading = false;
        state.workLifeEventLog = {
          ...state.workLifeEventLog,
          data: [...(state.workLifeEventLog.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createWorkLifeEventLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update employment contract
      .addCase(updateWorkLifeEventLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkLifeEventLog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workLifeEventLog.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.workLifeEventLog.data[index] = action.payload.data;
        } else {
          state.workLifeEventLog = {
            ...state.workLifeEventLog,
            data: [...(state.workLifeEventLog.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateWorkLifeEventLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete employment contract
      .addCase(deleteWorkLifeEventLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkLifeEventLog.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.workLifeEventLog.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.workLifeEventLog = {
          ...state.workLifeEventLog,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteWorkLifeEventLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch employment contract by ID
      .addCase(fetchWorkLifeEventLogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkLifeEventLogById.fulfilled, (state, action) => {
        state.loading = false;
        state.workLifeEventLogDetail = action.payload.data; // Consider renaming to contractDetail
      })
      .addCase(fetchWorkLifeEventLogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = workLifeEventLogSlice.actions;
export default workLifeEventLogSlice.reducer;
