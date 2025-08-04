import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all approval setup with optional filters (search, date range, pagination).
 */
export const fetchApprovalSetup = createAsyncThunk(
  "approvalSetup/fetchApprovalSetup",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/approval-workflow", {
        params,
      });
      return response.data; // Returns list of approval setup
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch approval setup"
      );
    }
  }
);

/**
 * Create a new approval setup.
 */
export const createApprovalSetup = createAsyncThunk(
  "approvalSetup/createApprovalSetup",
  async (approvalSetupData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/approval-workflow", approvalSetupData),
        {
          loading: "Creating approval setup...",
          success: (res) =>
            res.data.message || "Approval setup created successfully!",
          error: "Failed to create approval setup",
        }
      );
      return response.data; // Returns the newly created approval setup
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create approval setup"
      );
    }
  }
);

/**
 * Update an existing approval setup by ID.
 */
export const updateApprovalSetup = createAsyncThunk(
  "approvalSetup/updateApprovalSetup",
  async (request, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post(`/v1/approval-workflow-upsert`, request),
        {
          loading: "Updating approval setup...",
          success: (res) =>
            res.data.message || "Approval setup updated successfully!",
          error: "Failed to update approval setup",
        }
      );
      return response.data; // Returns the updated approval setup
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Approval setup not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update approval setup"
      );
    }
  }
);

/**
 * Delete an approval setup by ID.
 */
export const deleteApprovalSetup = createAsyncThunk(
  "approvalSetup/deleteApprovalSetup",
  async (request_type, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/approval-workflow/${request_type}`),
        {
          loading: "Deleting approval setup...",
          success: (res) =>
            res.data.message || "Approval setup deleted successfully!",
          error: "Failed to delete approval setup",
        }
      );
      return {
        data: { request_type },
        message: response.data.message || "Approval setup deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete approval setup"
      );
    }
  }
);

/**
 * Fetch a single approval setup by ID.
 */
export const fetchApprovalSetupById = createAsyncThunk(
  "approvalSetup/fetchApprovalSetupById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/approval-workflow/${id}`);
      return response.data; // Returns approval setup details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch approval setup"
      );
    }
  }
);

/**
 * Fetch a single approval setup by request type.
 */
export const fetchApprovalSetupByRequestType = createAsyncThunk(
  "approvalSetup/fetchApprovalSetupByRequestType",
  async (requestType, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/approval/get-all-workflow`, {
        params: {
          request_type: requestType,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch approval setup"
      );
    }
  }
);

const approvalSetupSlice = createSlice({
  name: "approvalSetup",
  initialState: {
    approvalSetup: {},
    approvalSetupDetail: null,
    approvalSetupByRequestType: null,
    loadingApprovalSetup: false,
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
      // Fetch all  approval setup
      .addCase(fetchApprovalSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalSetup.fulfilled, (state, action) => {
        state.loading = false;
        state.approvalSetup = action.payload.data;
      })
      .addCase(fetchApprovalSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create approval setup
      .addCase(createApprovalSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApprovalSetup.fulfilled, (state, action) => {
        state.loading = false;
        // state.approvalSetup = {
        //   ...state.approvalSetup,
        //   data: [...(state.approvalSetup.data || []), action.payload.data],
        // };
        state.success = action.payload.message;
      })
      .addCase(createApprovalSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update approval setup
      .addCase(updateApprovalSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApprovalSetup.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.approvalSetup.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.approvalSetup.data[index] = action.payload.data;
        } else {
          state.approvalSetup = {
            ...state.approvalSetup,
            data: [...(state.approvalSetup.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateApprovalSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete approval setup
      .addCase(deleteApprovalSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApprovalSetup.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.approvalSetup.data?.filter(
          (item) => item.request_type !== action.payload.data.request_type
        );
        state.approvalSetup = {
          ...state.approvalSetup,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteApprovalSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch approval setup by ID
      .addCase(fetchApprovalSetupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalSetupById.fulfilled, (state, action) => {
        state.loading = false;
        state.approvalSetupDetail = action.payload.data;
      })
      .addCase(fetchApprovalSetupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchApprovalSetupByRequestType.pending, (state) => {
        state.loadingApprovalSetupByRequestType = true;
        state.error = null;
      })
      .addCase(fetchApprovalSetupByRequestType.fulfilled, (state, action) => {
        state.loadingApprovalSetupByRequestType = false;
        state.approvalSetupByRequestType = action.payload.data;
      })
      .addCase(fetchApprovalSetupByRequestType.rejected, (state, action) => {
        state.loadingApprovalSetupByRequestType = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = approvalSetupSlice.actions;
export default approvalSetupSlice.reducer;
