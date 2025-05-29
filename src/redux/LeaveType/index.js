import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All leave types
export const fetchLeaveType = createAsyncThunk(
  "leaveType/fetchLeaveType",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(
        `/v1/leave-type?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}`
      );
      return response.data; // Returns a list of leave type
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leave type"
      );
    }
  }
);

// Add a leave type
export const addLeaveType = createAsyncThunk(
  "leaveType/addLeaveType",
  async (reqData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/leave-type", reqData),
        {
          loading: "Leave type adding...",
          success: (res) =>
            res.data.message || "Leave type added successfully!",
          error: "Failed to add leave type",
        }
      );

      return response.data; // Returns the newly added leave type
    } catch (error) {
      toast.error(error.response?.data || "Failed to add leave type");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add leave type"
      );
    }
  }
);

// Update a leave type
export const updateLeaveType = createAsyncThunk(
  "leaveType/updateLeaveType",
  async ({ id, reqData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/leave-type/${id}`, reqData),
        {
          loading: "Leave type updating...",
          success: (res) =>
            res.data.message || "Leave type updated successfully!",
          error: "Failed to update leave type",
        }
      );
      return response.data; // Returns the updated leave type
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Leave type not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Leave type not found",
        });
      }
      toast.error(error.response?.data || "Failed to update leave type");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update leave type"
      );
    }
  }
);

// Delete a leave type
export const deleteLeaveType = createAsyncThunk(
  "leaveType/deleteLeaveType",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/leave-type/${id}`),
        {
          loading: "Leave type deleting...",
          success: (res) =>
            res.data.message || "Leave type deleted successfully",
          error: "Failed to delete leave type",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Leave type deleted successfully",
      };
    } catch (error) {
      toast.error(error.response?.data || "Failed to delete leave type");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete leave type"
      );
    }
  }
);

// Fetch a Single leave type by ID
export const fetchLeaveTypeById = createAsyncThunk(
  "leaveType/fetchLeaveTypeById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/leave-type/${id}`);
      return response.data; // Returns the leave type details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leave type"
      );
    }
  }
);

const leaveTypeSlice = createSlice({
  name: "leaveType",
  initialState: {
    leaveType: [],
    leaveTypeDetail: null,
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveType = action.payload.data;
      })
      .addCase(fetchLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveType = {
          ...state.leaveType,
          data: [action.payload.data, ...state.leaveType.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leaveType.data?.findIndex(
          (user) => user.id === action.payload.data.id
        );
        if (index !== -1) {
          state.leaveType.data[index] = action.payload.data;
        } else {
          state.leaveType = {
            ...state.leaveType,
            data: [action.payload.data, ...state.leaveType.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.leaveType.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.leaveType = { ...state.leaveType, data: filteredData };
        state.success = action.payload.message;
      })
      .addCase(deleteLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchLeaveTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypeDetail = action.payload.data;
      })
      .addCase(fetchLeaveTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = leaveTypeSlice.actions;
export default leaveTypeSlice.reducer;
