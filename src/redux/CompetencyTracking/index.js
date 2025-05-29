import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all competency tracking with optional filters (search, date range, pagination).
 */
export const fetchCompetencyTracking = createAsyncThunk(
  "competencyTracking/fetchCompetencyTracking",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/competency-tracking", {
        params,
      });
      return response.data; // Returns list of competency tracking
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch competency tracking"
      );
    }
  }
);

/**
 * Create a new competency tracking.
 */
export const createCompetencyTracking = createAsyncThunk(
  "competencyTracking/createCompetencyTracking",
  async (competencyTrackingData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/competency-tracking", competencyTrackingData),
        {
          loading: "Creating competency tracking...",
          success: (res) =>
            res.data.message || "Competency tracking created successfully!",
          error: "Failed to create competency tracking",
        }
      );
      return response.data; // Returns the newly created competency tracking
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create competency tracking"
      );
    }
  }
);

/**
 * Update an existing competency tracking by ID.
 */
export const updateCompetencyTracking = createAsyncThunk(
  "competencyTracking/updateCompetencyTracking",
  async ({ id, competencyTrackingData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/competency-tracking/${id}`, competencyTrackingData),
        {
          loading: "Updating competency tracking...",
          success: (res) =>
            res.data.message || "Competency tracking updated successfully!",
          error: "Failed to update competency tracking",
        }
      );
      return response.data; // Returns the updated competency tracking
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Competency tracking not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update competency tracking"
      );
    }
  }
);

/**
 * Delete an competency tracking by ID.
 */
export const deleteCompetencyTracking = createAsyncThunk(
  "competencyTracking/deleteCompetencyTracking",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/competency-tracking/${id}`),
        {
          loading: "Deleting competency tracking...",
          success: (res) =>
            res.data.message || "Competency tracking deleted successfully!",
          error: "Failed to delete competency tracking",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Competency tracking deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete competency tracking"
      );
    }
  }
);

/**
 * Fetch a single competency tracking by ID.
 */
export const fetchCompetencyTrackingById = createAsyncThunk(
  "competencyTracking/fetchCompetencyTrackingById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/competency-tracking/${id}`);
      return response.data; // Returns competency tracking details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch competency tracking"
      );
    }
  }
);

const competencyTrackingSlice = createSlice({
  name: "competencyTracking",
  initialState: {
    competencyTracking: {},
    competencyTrackingDetail: null,
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
      // Fetch all competency tracking
      .addCase(fetchCompetencyTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetencyTracking.fulfilled, (state, action) => {
        state.loading = false;
        state.competencyTracking = action.payload.data;
      })
      .addCase(fetchCompetencyTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create competency tracking
      .addCase(createCompetencyTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompetencyTracking.fulfilled, (state, action) => {
        state.loading = false;
        state.competencyTracking = {
          ...state.competencyTracking,
          data: [...(state.competencyTracking.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createCompetencyTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update competency tracking
      .addCase(updateCompetencyTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompetencyTracking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competencyTracking.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.competencyTracking.data[index] = action.payload.data;
        } else {
          state.competencyTracking = {
            ...state.competencyTracking,
            data: [
              ...(state.competencyTracking.data || []),
              action.payload.data,
            ],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateCompetencyTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete competency tracking
      .addCase(deleteCompetencyTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompetencyTracking.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.competencyTracking.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.competencyTracking = {
          ...state.competencyTracking,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteCompetencyTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch competency tracking by ID
      .addCase(fetchCompetencyTrackingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetencyTrackingById.fulfilled, (state, action) => {
        state.loading = false;
        state.competencyTrackingDetail = action.payload.data;
      })
      .addCase(fetchCompetencyTrackingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = competencyTrackingSlice.actions;
export default competencyTrackingSlice.reducer;
