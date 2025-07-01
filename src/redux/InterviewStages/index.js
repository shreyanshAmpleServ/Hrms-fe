import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all interview stages with optional filters (search, date range, pagination).
 */
export const fetchInterviewStages = createAsyncThunk(
  "interviewStages/fetchInterviewStages",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.startDate) params.startDate = datas?.startDate?.toISOString();
      if (datas?.endDate) params.endDate = datas?.endDate?.toISOString();
      if (datas?.is_active) params.is_active = datas?.is_active;

      const response = await apiClient.get("/v1/interview-stage", {
        params,
      });
      return response.data; // Returns list of interview stages
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch interview stages"
      );
    }
  }
);

/**
 * Create a new interview stage.
 */
export const createInterviewStage = createAsyncThunk(
  "interviewStages/createInterviewStage",
  async (interviewStageData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/interview-stage", interviewStageData),
        {
          loading: "Creating interview stage...",
          success: (res) =>
            res.data.message || "interview stage created successfully!",
          error: "Failed to create interview stage",
        }
      );
      return response.data; // Returns the newly created interview stage
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create interview stage"
      );
    }
  }
);

/**
 * Update an existing interview stage by ID.
 */
export const updateInterviewStage = createAsyncThunk(
  "interviewStages/updateInterviewStage",
  async ({ id, interviewStageData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/interview-stage/${id}`, interviewStageData),
        {
          loading: "Updating interview stage...",
          success: (res) =>
            res.data.message || "interview stage updated successfully!",
          error: "Failed to update interview stage",
        }
      );
      return response.data; // Returns the updated interview stage
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "interview stage not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update interview stage"
      );
    }
  }
);

/**
 * Delete an application source by ID.
 */
export const deleteInterviewStage = createAsyncThunk(
  "interviewStages/deleteInterviewStage",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/interview-stage/${id}`),
        {
          loading: "Deleting interview stage...",
          success: (res) =>
            res.data.message || "interview stage deleted successfully!",
          error: "Failed to delete interview stage",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "interview stage deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete interview stage"
      );
    }
  }
);

/**
 * Fetch a single application source by ID.
 */
export const fetchInterviewStageById = createAsyncThunk(
  "interviewStages/fetchInterviewStageById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/interview-stage/${id}`);
      return response.data; // Returns interview stage details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch interview stage"
      );
    }
  }
);

const interviewStagesSlice = createSlice({
  name: "interviewStages",
  initialState: {
    interviewStages: {},
    interviewStageDetail: null,
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
      // Fetch all interview stages
      .addCase(fetchInterviewStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewStages.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewStages = action.payload.data;
      })
      .addCase(fetchInterviewStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create interview stage
      .addCase(createInterviewStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInterviewStage.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewStages = {
          ...state.interviewStages,
          data: [...(state.interviewStages.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createInterviewStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update interview stage
      .addCase(updateInterviewStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInterviewStage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.interviewStages.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.interviewStages.data[index] = action.payload.data;
        } else {
          state.interviewStages = {
            ...state.interviewStages,
            data: [...(state.interviewStages.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateInterviewStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete interview stage
      .addCase(deleteInterviewStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInterviewStage.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.interviewStages.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.interviewStages = {
          ...state.interviewStages,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteInterviewStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch interview stage by ID
      .addCase(fetchInterviewStageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewStageById.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewStageDetail = action.payload.data;
      })
      .addCase(fetchInterviewStageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = interviewStagesSlice.actions;
export default interviewStagesSlice.reducer;
