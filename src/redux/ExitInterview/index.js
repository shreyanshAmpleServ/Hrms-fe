import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all exit interview with optional filters (search, date range, pagination).
 */
export const fetchExitInterview = createAsyncThunk(
  "exitInterview/fetchExitInterview",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/exit-interview", {
        params,
      });
      return response.data; // Returns list of exit interview
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch exit interview"
      );
    }
  }
);

/**
 * Create a new exit interview.
 */
export const createExitInterview = createAsyncThunk(
  "exitInterview/createExitInterview",
  async (exitInterviewData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/exit-interview", exitInterviewData),
        {
          loading: "Creating exit interview...",
          success: (res) =>
            res.data.message || "Exit interview created successfully!",
          error: "Failed to create exit interview",
        }
      );
      return response.data; // Returns the newly created exit interview
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create exit interview"
      );
    }
  }
);

/**
 * Update an existing exit interview by ID.
 */
export const updateExitInterview = createAsyncThunk(
  "exitInterview/updateExitInterview",
  async ({ id, exitInterviewData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/exit-interview/${id}`, exitInterviewData),
        {
          loading: "Updating exit interview...",
          success: (res) =>
            res.data.message || "Exit interview updated successfully!",
          error: "Failed to update exit interview",
        }
      );
      return response.data; // Returns the updated exit interview
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Exit interview not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update exit interview"
      );
    }
  }
);

/**
 * Delete an exit interview by ID.
 */
export const deleteExitInterview = createAsyncThunk(
  "exitInterview/deleteExitInterview",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/exit-interview/${id}`),
        {
          loading: "Deleting exit interview...",
          success: (res) =>
            res.data.message || "Exit interview deleted successfully!",
          error: "Failed to delete exit interview",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Exit interview deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete exit interview"
      );
    }
  }
);

/**
 * Fetch a single exit interview by ID.
 */
export const fetchExitInterviewById = createAsyncThunk(
  "exitInterview/fetchExitInterviewById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/exit-interview/${id}`);
      return response.data; // Returns exit interview details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch exit interview"
      );
    }
  }
);

const exitInterviewSlice = createSlice({
  name: "exitInterview",
  initialState: {
    exitInterview: {},
    exitInterviewDetail: null,
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
      // Fetch all exit interview
      .addCase(fetchExitInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExitInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.exitInterview = action.payload.data;
      })
      .addCase(fetchExitInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create exit interview
      .addCase(createExitInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExitInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.exitInterview = {
          ...state.exitInterview,
          data: [...(state.exitInterview.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createExitInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update exit interview
      .addCase(updateExitInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExitInterview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.exitInterview.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.exitInterview.data[index] = action.payload.data;
        } else {
          state.exitInterview = {
            ...state.exitInterview,
            data: [...(state.exitInterview.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateExitInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete exit interview
      .addCase(deleteExitInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExitInterview.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.exitInterview.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.exitInterview = {
          ...state.exitInterview,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteExitInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch exit interview by ID
      .addCase(fetchExitInterviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExitInterviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.exitInterviewDetail = action.payload.data;
      })
      .addCase(fetchExitInterviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = exitInterviewSlice.actions;
export default exitInterviewSlice.reducer;
