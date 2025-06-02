import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all exit clearance with optional filters (search, date range, pagination).
 */
export const fetchExitClearance = createAsyncThunk(
  "exitClearance/fetchExitClearance",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/exit-clearance", {
        params,
      });
      return response.data; // Returns list of exit clearance
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch exit clearance"
      );
    }
  }
);

/**
 * Create a new exit clearance.
 */
export const createExitClearance = createAsyncThunk(
  "exitClearance/createExitClearance",
  async (exitClearanceData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/exit-clearance", exitClearanceData),
        {
          loading: "Creating exit clearance...",
          success: (res) =>
            res.data.message || "Exit clearance created successfully!",
          error: "Failed to create exit clearance",
        }
      );
      return response.data; // Returns the newly created exit clearance
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create exit clearance"
      );
    }
  }
);

/**
 * Update an existing exit clearance by ID.
 */
export const updateExitClearance = createAsyncThunk(
  "exitClearance/updateExitClearance",
  async ({ id, exitClearanceData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/exit-clearance/${id}`, exitClearanceData),
        {
          loading: "Updating exit clearance...",
          success: (res) =>
            res.data.message || "Exit clearance updated successfully!",
          error: "Failed to update exit clearance",
        }
      );
      return response.data; // Returns the updated exit clearance
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Exit clearance not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update exit clearance"
      );
    }
  }
);

/**
 * Delete an exit clearance by ID.
 */
export const deleteExitClearance = createAsyncThunk(
  "exitClearance/deleteExitClearance",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/exit-clearance/${id}`),
        {
          loading: "Deleting exit clearance...",
          success: (res) =>
            res.data.message || "Exit clearance deleted successfully!",
          error: "Failed to delete exit clearance",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Exit clearance deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete exit clearance"
      );
    }
  }
);

/**
 * Fetch a single exit clearance by ID.
 */
export const fetchExitClearanceById = createAsyncThunk(
  "exitClearance/fetchExitClearanceById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/exit-clearance/${id}`);
      return response.data; // Returns exit clearance details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch exit clearance"
      );
    }
  }
);

const exitClearanceSlice = createSlice({
  name: "exitClearance",
  initialState: {
    exitClearance: {},
    exitClearanceDetail: null,
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
      // Fetch all exit clearance
      .addCase(fetchExitClearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExitClearance.fulfilled, (state, action) => {
        state.loading = false;
        state.exitClearance = action.payload.data;
      })
      .addCase(fetchExitClearance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create exit clearance
      .addCase(createExitClearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExitClearance.fulfilled, (state, action) => {
        state.loading = false;
        state.exitClearance = {
          ...state.exitClearance,
          data: [...(state.exitClearance.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createExitClearance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update exit clearance
      .addCase(updateExitClearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExitClearance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.exitClearance.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.exitClearance.data[index] = action.payload.data;
        } else {
          state.exitClearance = {
            ...state.exitClearance,
            data: [...(state.exitClearance.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateExitClearance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete exit clearance
      .addCase(deleteExitClearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExitClearance.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.exitClearance.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.exitClearance = {
          ...state.exitClearance,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteExitClearance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch exit clearance by ID
      .addCase(fetchExitClearanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExitClearanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.exitClearanceDetail = action.payload.data;
      })
      .addCase(fetchExitClearanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = exitClearanceSlice.actions;
export default exitClearanceSlice.reducer;
