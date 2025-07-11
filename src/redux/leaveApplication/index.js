import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";

export const fetchleave_application = createAsyncThunk(
  "leave_application/fetchleave_application",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/leave-application", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch review-template"
      );
    }
  }
);

export const addleave_application = createAsyncThunk(
  "leave_application/addleave_application",
  async (leave_applicationData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/leave-application", leave_applicationData),
        {
          loading: "Adding leave application...",
          success: "Leave application added successfully",
          error: (error) => {
            return (
              error.response.data.message || "Failed to add leave application"
            );
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add leave_application"
      );
    }
  }
);

export const updateleave_application = createAsyncThunk(
  "leave_application/updateleave_application",
  async ({ id, leave_applicationData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/leave-application/${id}`, leave_applicationData),
        {
          loading: "Updating leave application...",
          success: "Leave application updated successfully",
          error: "Failed to update leave application",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update leave_application"
      );
    }
  }
);

export const deleteleave_application = createAsyncThunk(
  "leave_application/deleteleave_application",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/leave-application/${id}`),
        {
          loading: "Deleting leave application...",
          success: "Leave application deleted successfully",
          error: "Failed to delete leave application",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "leave_application deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete leave_application"
      );
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  "leave_application/updateLeaveStatus",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.patch(`/v1/leave-application/${id}/status`, data),
        {
          loading: "Updating leave application status...",
          success: "Leave application status updated successfully",
          error: "Failed to update leave application status",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update leave_application_status"
      );
    }
  }
);
const leave_applicationSlice = createSlice({
  name: "leave_application",
  initialState: {
    leave_application: [],
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
      .addCase(fetchleave_application.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchleave_application.fulfilled, (state, action) => {
        state.loading = false;
        state.leave_application = action.payload.data;
      })
      .addCase(fetchleave_application.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addleave_application.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addleave_application.fulfilled, (state, action) => {
        state.loading = false;
        state.leave_application = {
          ...state.leave_application,
          data: [action.payload.data, ...state.leave_application.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addleave_application.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateleave_application.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateleave_application.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leave_application?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.leave_application.data[index] = action.payload.data;
        } else {
          state.leave_application = {
            ...state.leave_application,
            data: [...state.leave_application, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateleave_application.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteleave_application.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteleave_application.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.leave_application.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.leave_application = {
          ...state.leave_application,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteleave_application.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateLeaveStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leave_application?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.leave_application.data[index] = action.payload.data;
        }
        state.success = action.payload.message;
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = leave_applicationSlice.actions;
export default leave_applicationSlice.reducer;
