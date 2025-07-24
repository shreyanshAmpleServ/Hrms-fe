import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch leave balance by employee.
 */
export const fetchLeaveBalanceByEmployee = createAsyncThunk(
  "leaveBalance/fetchLeaveBalanceByEmployee",
  async (datas, thunkAPI) => {
    try {
      let params = { employeeId: datas?.employeeId };
      if (datas?.is_active) params.is_active = datas?.is_active;

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

/**
 * Fetch leave balance by employee.
 */
export const fetchLeaveBalanceByEmployeeId = createAsyncThunk(
  "leaveBalance/fetchLeaveBalanceByEmployeeId",
  async (datas, thunkAPI) => {
    const employeeId = datas?.employeeId;
    try {
      const response = await apiClient.get(
        `/v1/leave-balance-by-employee/${employeeId}`
      );
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
      let params = {};
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.search) params.search = datas?.search;
      if (datas?.is_active) params.is_active = datas?.is_active;

      const response = await apiClient.get("/v1/leave-balance", {
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
export const fetchLeaveBalanceById = createAsyncThunk(
  "leaveBalance/fetchLeaveBalanceById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/leave-balance/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leave balance by id"
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
      return { id, message: response.data.message };
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
          error: (error) => error.response?.data?.message,
        }
      );
      return response.data;
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
        apiClient.put(`/v1/leave-balance/${datas.id}`, datas.reqData),
        {
          loading: "Updating leave balance...",
          success: (res) =>
            res.data.message || "Leave balance updated successfully!",
          error: (error) => error.response?.data?.message,
        }
      );
      return response.data;
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
    leaveBalanceByEmployeeId: null,
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
        const filterData = state.leaveBalance.data?.filter(
          (item) => item.id !== action.payload.id
        );
        state.leaveBalance.data = filterData;
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
        state.leaveBalance.data = [
          ...state.leaveBalance.data,
          action.payload.data,
        ];
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
        state.leaveBalance.data = state.leaveBalance.data.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item
        );
      })
      .addCase(updateLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchLeaveBalanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveBalanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalanceDetail = action.payload;
      })
      .addCase(fetchLeaveBalanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchLeaveBalanceByEmployeeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveBalanceByEmployeeId.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalanceByEmployeeId = action.payload;
      })
      .addCase(fetchLeaveBalanceByEmployeeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});
export const { clearMessages } = leaveBalanceSlice.actions;
export default leaveBalanceSlice.reducer;
