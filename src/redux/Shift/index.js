import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";

export const fetchShift = createAsyncThunk(
  "shift/fetchShift",
  async (datas, thunkAPI) => {
    const params = new URLSearchParams();
    if (datas?.search) params.append("search", datas?.search);
    if (datas?.page) params.append("page", datas?.page);
    if (datas?.size) params.append("size", datas?.size);
    if (datas?.is_active) params.append("is_active", datas?.is_active);
    try {
      const response = await apiClient.get(`/v1/shift?${params.toString()}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch shift"
      );
    }
  }
);

export const addShift = createAsyncThunk(
  "shift/addShift",
  async (shiftData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/shift", shiftData),
        {
          loading: "Adding shift...",
          success: (res) => res.data.message || "Shift added successfully!",
          error: "Failed to add shift",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add shift"
      );
    }
  }
);

export const updateShift = createAsyncThunk(
  "shift/updateShift",
  async ({ id, ShiftData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/shift/${id}`, ShiftData),
        {
          loading: "Updating shift...",
          success: (res) => res.data.message || "Shift updated successfully!",
          error: "Failed to update shift",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("shift not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "shift not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update shift"
      );
    }
  }
);

export const deleteShift = createAsyncThunk(
  "shift/deleteShift",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/shift/${id}`),
        {
          loading: "Deleting shift...",
          success: (res) => res.data.message || "Shift deleted successfully!",
          error: "Failed to delete shift",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Shift deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete shift"
      );
    }
  }
);

export const fetchShiftById = createAsyncThunk(
  "shift/fetchShiftById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/shift/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch shift"
      );
    }
  }
);

const shiftSlice = createSlice({
  name: "shift",
  initialState: {
    shift: [],
    shiftDetail: null,
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
      .addCase(fetchShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShift.fulfilled, (state, action) => {
        state.loading = false;
        state.shift = action.payload.data;
      })
      .addCase(fetchShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addShift.fulfilled, (state, action) => {
        state.loading = false;
        state.shift = {
          ...state.shift,
          data: [action.payload.data, ...state.shift.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shift.data?.findIndex(
          (user) => user.id === action.payload.data.id
        );
        if (index !== -1) {
          state.shift.data[index] = action.payload.data;
        } else {
          state.shift = {
            ...state.shift,
            data: [action.payload.data, ...state.shift.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.shift.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.shift = { ...state.shift, data: filteredData };
        state.success = action.payload.message;
      })
      .addCase(deleteShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchShiftById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShiftById.fulfilled, (state, action) => {
        state.loading = false;
        state.shiftDetail = action.payload.data;
      })
      .addCase(fetchShiftById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = shiftSlice.actions;
export default shiftSlice.reducer;
