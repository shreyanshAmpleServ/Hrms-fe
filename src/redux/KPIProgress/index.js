import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all KPI progress with optional filters (search, date range, pagination).
 */
export const fetchKPIProgress = createAsyncThunk(
  "kpiProgress/fetchKPIProgress",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/kpi-progress", {
        params,
      });
      return response.data; // Returns list of KPI progress
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch KPI progress"
      );
    }
  }
);

/**
 * Create a new KPI progress.
 */
export const createKPIProgress = createAsyncThunk(
  "kpiProgress/createKPIProgress",
  async (KPIProgressData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/kpi-progress", KPIProgressData),
        {
          loading: "Creating KPI progress...",
          success: (res) =>
            res.data.message || "KPI Progress created successfully!",
          error: "Failed to create KPI Progress",
        }
      );
      return response.data; // Returns the newly created KPI progress
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create KPI Progress"
      );
    }
  }
);

/**
 * Update an existing KPI progress by ID.
 */
export const updateKPIProgress = createAsyncThunk(
  "kpiProgress/updateKPIProgress",
  async ({ id, KPIProgressData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/kpi-progress/${id}`, KPIProgressData),
        {
          loading: "Updating KPI progress...",
          success: (res) =>
            res.data.message || "KPI Progress updated successfully!",
          error: "Failed to update KPI Progress",
        }
      );
      return response.data; // Returns the updated KPI progress
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "KPI Progress not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update KPI Progress"
      );
    }
  }
);

/**
 * Delete an KPI progress by ID.
 */
export const deleteKPIProgress = createAsyncThunk(
  "kpiProgress/deleteKPIProgress",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/kpi-progress/${id}`),
        {
          loading: "Deleting KPI progress...",
          success: (res) =>
            res.data.message || "KPI Progress deleted successfully!",
          error: "Failed to delete KPI progress",
        }
      );
      return {
        data: { id },
        message: response.data.message || "KPI Progress deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete KPI progress"
      );
    }
  }
);

/**
 * Fetch a single KPI progress by ID.
 */
export const fetchKPIProgressById = createAsyncThunk(
  "kpiProgress/fetchKPIProgressById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/kpi-progress/${id}`);
      return response.data; // Returns KPI progress details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch KPI progress"
      );
    }
  }
);

const kpiProgressSlice = createSlice({
  name: "kpiProgress",
  initialState: {
    kpiProgress: {},
    kpiProgressDetail: null,
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
      // Fetch all KPI progress
      .addCase(fetchKPIProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKPIProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.kpiProgress = action.payload.data;
      })
      .addCase(fetchKPIProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create KPI progress
      .addCase(createKPIProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKPIProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.kpiProgress = {
          ...state.kpiProgress,
          data: [...(state.kpiProgress.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createKPIProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update KPI progress
      .addCase(updateKPIProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKPIProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.kpiProgress.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.kpiProgress.data[index] = action.payload.data;
        } else {
          state.kpiProgress = {
            ...state.kpiProgress,
            data: [...(state.kpiProgress.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateKPIProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete KPI progress
      .addCase(deleteKPIProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteKPIProgress.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.kpiProgress.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.kpiProgress = {
          ...state.kpiProgress,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteKPIProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch KPI progress by ID
      .addCase(fetchKPIProgressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKPIProgressById.fulfilled, (state, action) => {
        state.loading = false;
        state.kpiProgressDetail = action.payload.data;
      })
      .addCase(fetchKPIProgressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = kpiProgressSlice.actions;
export default kpiProgressSlice.reducer;
