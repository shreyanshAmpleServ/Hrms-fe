import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all Asset Assignment with optional filters (search, date range, pagination).
 */
export const fetchAssetAssignment = createAsyncThunk(
  "assetAssignment/fetchAssetAssignment",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/asset-assignment", {
        params,
      });
      return response.data; // Returns list of Asset Assignment
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Asset Assignment"
      );
    }
  }
);

/**
 * Create a new Asset Assignment.
 */
export const createAssetAssignment = createAsyncThunk(
  "assetAssignment/createAssetAssignment",
  async (assetAssignmentData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/asset-assignment", assetAssignmentData),
        {
          loading: "Creating Asset Assignment...",
          success: (res) =>
            res.data.message || "Asset Assignment created successfully!",
          error: "Failed to create Asset Assignment",
        }
      );
      return response.data; // Returns the newly created Asset Assignment
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create Asset Assignment"
      );
    }
  }
);

/**
 * Update an existing Asset Assignment by ID.
 */
export const updateAssetAssignment = createAsyncThunk(
  "assetAssignment/updateAssetAssignment",
  async ({ id, assetAssignmentData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/asset-assignment/${id}`, assetAssignmentData),
        {
          loading: "Updating Asset Assignment...",
          success: (res) =>
            res.data.message || "Asset Assignment updated successfully!",
          error: "Failed to update Asset Assignment",
        }
      );
      return response.data; // Returns the updated Asset Assignment
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Asset Assignment not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update Asset Assignment"
      );
    }
  }
);

/**
 * Delete an Asset Assignment by ID.
 */
export const deleteAssetAssignment = createAsyncThunk(
  "assetAssignment/deleteAssetAssignment",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/asset-assignment/${id}`),
        {
          loading: "Deleting Asset Assignment...",
          success: (res) =>
            res.data.message || "Asset Assignment deleted successfully!",
          error: "Failed to delete Asset Assignment",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Asset Assignment deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete Asset Assignment"
      );
    }
  }
);

/**
 * Fetch a single Asset Assignment by ID.
 */
export const fetchAssetAssignmentById = createAsyncThunk(
  "assetAssignment/fetchAssetAssignmentById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/asset-assignment/${id}`);
      return response.data; // Returns Asset Assignment details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Asset Assignment"
      );
    }
  }
);

const assetAssignmentSlice = createSlice({
  name: "assetAssignment",
  initialState: {
    assetAssignment: {},
    assetAssignmentDetail: null,
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
      // Fetch all Asset Assignment
      .addCase(fetchAssetAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assetAssignment = action.payload.data;
      })
      .addCase(fetchAssetAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create Asset Assignment
      .addCase(createAssetAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssetAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assetAssignment = {
          ...state.assetAssignment,
          data: [...(state.assetAssignment.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createAssetAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update Asset Assignment
      .addCase(updateAssetAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssetAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assetAssignment.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.assetAssignment.data[index] = action.payload.data;
        } else {
          state.assetAssignment = {
            ...state.assetAssignment,
            data: [...(state.assetAssignment.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateAssetAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete Asset Assignment
      .addCase(deleteAssetAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssetAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.assetAssignment.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.assetAssignment = {
          ...state.assetAssignment,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteAssetAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch Asset Assignment by ID
      .addCase(fetchAssetAssignmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetAssignmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.assetAssignmentDetail = action.payload.data;
      })
      .addCase(fetchAssetAssignmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = assetAssignmentSlice.actions;
export default assetAssignmentSlice.reducer;
