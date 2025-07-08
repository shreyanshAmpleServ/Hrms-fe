import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all overtime Master with optional filters (search, date range, pagination).
 */
export const fetchOverTimeMaster = createAsyncThunk(
  "overtimeMaster/fetchOverTimeMaster",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/overtime-setup", {
        params,
      });
      return response.data; // Returns list of overtime Master
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch overtime Master"
      );
    }
  }
);

/**
 * Create a new overtime Master.
 */
export const createOverTimeMaster = createAsyncThunk(
  "overtimeMaster/createOverTimeMaster",
  async (overtimeMasterData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/overtime-setup", overtimeMasterData),
        {
          loading: "Creating overtime Master...",
          success: (res) =>
            res.data.message || "Overtime Master created successfully!",
          error: "Failed to create overtime Master",
        }
      );
      return response.data; // Returns the newly created overtime Master
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create overtime Master"
      );
    }
  }
);

/**
 * Update an existing overtime Master by ID.
 */
export const updateOverTimeMaster = createAsyncThunk(
  "overtimeMaster/updateOverTimeMaster",
  async ({ id, overtimeMasterData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/overtime-setup/${id}`, overtimeMasterData),
        {
          loading: "Updating overtime Master...",
          success: (res) =>
            res.data.message || "Overtime Master updated successfully!",
          error: "Failed to update overtime Master",
        }
      );
      return response.data; // Returns the updated overtime Master
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Overtime Master not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update overtime Master"
      );
    }
  }
);

/**
 * Delete an overtime Master by ID.
 */
export const deleteOverTimeMaster = createAsyncThunk(
  "overtimeMaster/deleteOverTimeMaster",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/overtime-setup/${id}`),
        {
          loading: "Deleting overtime Master...",
          success: (res) =>
            res.data.message || "Overtime Master deleted successfully!",
          error: "Failed to delete overtime Master",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Overtime Master deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete overtime Master"
      );
    }
  }
);

/**
 * Fetch a single overtime Master by ID.
 */
export const fetchOverTimeMasterById = createAsyncThunk(
  "overtimeMaster/fetchOverTimeMasterById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/overtime-setup/${id}`);
      return response.data; // Returns overtime Master details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch overtime Master"
      );
    }
  }
);

const overtimeMasterSlice = createSlice({
  name: "overtimeMaster",
  initialState: {
    overtimeMaster: {},
    overtimeMasterDetail: null,
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
      // Fetch all overtime Master
      .addCase(fetchOverTimeMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverTimeMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.overtimeMaster = action.payload.data;
      })
      .addCase(fetchOverTimeMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create overtime Master
      .addCase(createOverTimeMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOverTimeMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.overtimeMaster = {
          ...state.overtimeMaster,
          data: [...(state.overtimeMaster.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createOverTimeMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update overtime Master
      .addCase(updateOverTimeMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOverTimeMaster.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.overtimeMaster.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.overtimeMaster.data[index] = action.payload.data;
        } else {
          state.overtimeMaster = {
            ...state.overtimeMaster,
            data: [...(state.overtimeMaster.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateOverTimeMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete overtime Master
      .addCase(deleteOverTimeMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOverTimeMaster.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.overtimeMaster.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.overtimeMaster = {
          ...state.overtimeMaster,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteOverTimeMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch overtime Master by ID
      .addCase(fetchOverTimeMasterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverTimeMasterById.fulfilled, (state, action) => {
        state.loading = false;
        state.overtimeMasterDetail = action.payload.data;
      })
      .addCase(fetchOverTimeMasterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = overtimeMasterSlice.actions;
export default overtimeMasterSlice.reducer;
