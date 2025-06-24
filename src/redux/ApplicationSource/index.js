import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all application source with optional filters (search, date range, pagination).
 */
export const fetchApplicationSource = createAsyncThunk(
  "applicationSource/fetchApplicationSource",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/application-source", {
        params,
      });
      return response.data; // Returns list of application source
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch application source"
      );
    }
  }
);

/**
 * Create a new application source.
 */
export const createApplicationSource = createAsyncThunk(
  "applicationSource/createApplicationSource",
  async (applicationSourceData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/application-source", applicationSourceData),
        {
          loading: "Creating application source...",
          success: (res) =>
            res.data.message || "application source created successfully!",
          error: "Failed to create application source",
        }
      );
      return response.data; // Returns the newly created application source
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create application source"
      );
    }
  }
);

/**
 * Update an existing application source by ID.
 */
export const updateApplicationSource = createAsyncThunk(
  "applicationSource/updateApplicationSource",
  async ({ id, applicationSourceData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/application-source/${id}`, applicationSourceData),
        {
          loading: "Updating application source...",
          success: (res) =>
            res.data.message || "application source updated successfully!",
          error: "Failed to update application source",
        }
      );
      return response.data; // Returns the updated application source
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "application source not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update application source"
      );
    }
  }
);

/**
 * Delete an application source by ID.
 */
export const deleteApplicationSource = createAsyncThunk(
  "applicationSource/deleteApplicationSource",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/application-source/${id}`),
        {
          loading: "Deleting application source...",
          success: (res) =>
            res.data.message || "application source deleted successfully!",
          error: "Failed to delete application source",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "application source deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete application source"
      );
    }
  }
);

/**
 * Fetch a single application source by ID.
 */
export const fetchApplicationSourceById = createAsyncThunk(
  "applicationSource/fetchApplicationSourceById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/application-source/${id}`);
      return response.data; // Returns application source details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch application source"
      );
    }
  }
);

const applicationSourceSlice = createSlice({
  name: "applicationSource",
  initialState: {
    applicationSource: {},
    applicationSourceDetail: null,
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
      // Fetch all application source
      .addCase(fetchApplicationSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationSource.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationSource = action.payload.data;
      })
      .addCase(fetchApplicationSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create application source
      .addCase(createApplicationSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplicationSource.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationSource = {
          ...state.applicationSource,
          data: [...(state.applicationSource.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createApplicationSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update application source
      .addCase(updateApplicationSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationSource.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.applicationSource.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.applicationSource.data[index] = action.payload.data;
        } else {
          state.applicationSource = {
            ...state.applicationSource,
            data: [
              ...(state.applicationSource.data || []),
              action.payload.data,
            ],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateApplicationSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete application source
      .addCase(deleteApplicationSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApplicationSource.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.applicationSource.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.applicationSource = {
          ...state.applicationSource,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteApplicationSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch application source by ID
      .addCase(fetchApplicationSourceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationSourceById.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationSourceDetail = action.payload.data;
      })
      .addCase(fetchApplicationSourceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = applicationSourceSlice.actions;
export default applicationSourceSlice.reducer;
