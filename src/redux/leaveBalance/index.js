import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch leave balance by employee.
 */
export const fetchLeaveBalanceByEmployee = createAsyncThunk(
  "leaveBalance/fetchLeaveBalanceByEmployee",
  async (req, thunkAPI) => {
    try {
      const params = {
        employeeId: req?.employeeId || "",
        leaveTypeId: req?.leaveTypeId || "",
      };
      const response = await apiClient.get("/v1/leave-balance-by-employee", {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leave balance"
      );
    }
  }
);
export const fetchLeaveBalance = createAsyncThunk(
  "leaveBalance/fetchLeaveBalance",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/leave-balance", {
        params: {
          page: datas?.page || 1,
          limit: datas?.limit || 10,
          search: datas?.search || "",
        },
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leave balance"
      );
    }
  }
);

export const deleteLeaveBalance = createAsyncThunk(
  "leaveBalance/deleteLeaveBalance",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/leave-balance/${id}`),
        {
          loading: "Deleting leave balance...",
          success: (res) =>
            res.data.message || "Leave balance deleted successfully!",
          error: "Failed to delete leave balance",
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete leave balance"
      );
    }
  }
);
export const createLeaveBalance = createAsyncThunk(
  "leaveBalance/createLeaveBalance",
  async (datas, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/leave-balance", datas),
        {
          loading: "Creating leave balance...",
          success: (res) =>
            res.data.message || "Leave balance created successfully!",
          error: "Failed to create leave balance",
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create leave balance"
      );
    }
  }
);
export const updateLeaveBalance = createAsyncThunk(
  "leaveBalance/updateLeaveBalance",
  async (datas, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/leave-balance/${datas.id}`, datas),
        {
          loading: "Updating leave balance...",
          success: (res) =>
            res.data.message || "Leave balance updated successfully!",
          error: "Failed to update leave balance",
        }
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update leave balance"
      );
    }
  }
);
const leaveBalanceSlice = createSlice({
  name: "leaveBalance",
  initialState: {
    leaveBalance: {},
    leaveBalanceDetail: null,
    leaveBalanceByEmployee: [],
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
      .addCase(fetchLeaveBalanceByEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveBalanceByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalanceByEmployee = action.payload.data;
      })
      .addCase(fetchLeaveBalanceByEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchLeaveBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalance = action.payload.data;
      })
      .addCase(fetchLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteLeaveBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createLeaveBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(createLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateLeaveBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(updateLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});
export const { clearMessages } = leaveBalanceSlice.actions;
export default leaveBalanceSlice.reducer;
