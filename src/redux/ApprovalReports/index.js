import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all approval reports with optional filters (search, date range, pagination).
 */
export const fetchApprovalReports = createAsyncThunk(
  "approvalReports/fetchApprovalReports",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
        request_type: datas?.request_type || "",
        approver_id: datas?.approver_id || "",
        status: datas?.status || "",
      };
      const response = await apiClient.get("/v1/request-approval", {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch approval reports"
      );
    }
  }
);

/**
 * Create a new approval report.
 */
export const createApprovalReports = createAsyncThunk(
  "approvalReports/createApprovalReports",
  async (approvalReportsData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/request-approval", approvalReportsData),
        {
          loading: "Creating approval reports...",
          success: (res) =>
            res.data.message || "Approval reports created successfully!",
          error: (error) =>
            error.response?.data.message || "Failed to create approval reports",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create approval reports"
      );
    }
  }
);

/**
 * Update an existing approval report by ID.
 */
export const updateApprovalReports = createAsyncThunk(
  "approvalReports/updateApprovalReports",
  async ({ id, approvalReportsData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/request-approval/${id}`, approvalReportsData),
        {
          loading: "Updating approval reports...",
          success: (res) =>
            res.data.message || "Approval reports updated successfully!",
          error: "Failed to update approval reports",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Leave encashment not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update approval reports"
      );
    }
  }
);

/**
 * Delete an approval report by ID.
 */
export const deleteApprovalReports = createAsyncThunk(
  "approvalReports/deleteApprovalReports",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/request-approval/${id}`),
        {
          loading: "Deleting approval reports...",
          success: (res) =>
            res.data.message || "Approval reports deleted successfully!",
          error: "Failed to delete approval reports",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Approval reports deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete approval reports"
      );
    }
  }
);

/**
 * Fetch a single approval reports by ID.
 */
export const fetchApprovalReportsById = createAsyncThunk(
  "approvalReports/fetchApprovalReportsById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/request-approval/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch approval reports"
      );
    }
  }
);

const approvalReportsSlice = createSlice({
  name: "approvalReports",
  initialState: {
    approvalReports: {},
    approvalReportsDetail: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovalReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalReports.fulfilled, (state, action) => {
        state.loading = false;
        state.approvalReports = action.payload.data;
      })
      .addCase(fetchApprovalReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(createApprovalReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApprovalReports.fulfilled, (state, action) => {
        state.loading = false;
        state.approvalReports = {
          ...state.approvalReports,
          data: [...(state.approvalReports.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createApprovalReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(updateApprovalReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApprovalReports.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.approvalReports.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.approvalReports.data[index] = action.payload.data;
        } else {
          state.approvalReports = {
            ...state.approvalReports,
            data: [...(state.approvalReports.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateApprovalReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(deleteApprovalReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApprovalReports.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.approvalReports.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.approvalReports = { ...state.approvalReports, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deleteApprovalReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(fetchApprovalReportsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalReportsById.fulfilled, (state, action) => {
        state.loading = false;
        state.approvalReportsDetail = action.payload.data;
      })
      .addCase(fetchApprovalReportsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = approvalReportsSlice.actions;
export default approvalReportsSlice.reducer;
