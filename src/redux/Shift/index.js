import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All shifts
export const fetchShift = createAsyncThunk(
  "shift/fetchShift",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/shift?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}`);
      return response.data; // Returns a list of shift
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch shift",
      );
    }
  },
);

// Add a shift
export const addShift = createAsyncThunk(
  "shift/addShift",
  async (shiftData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/shift", shiftData),
        {
          loading: " shift adding...",
          success: (res) => res.data.message || "shift added successfully!",
          error: "Failed to add shift",
        }
      );
      // const response = await apiClient.post("/v1/shift", shiftData);
      // toast.success(response.data.message || "shift created successfully");
      return response.data; // Returns the newly added shift
    } catch (error) {
      toast.error(error.response?.data || "Failed to add shift");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add shift",
      );
    }
  },
);

// Update a shift
export const updateShift = createAsyncThunk(
  "shift/updateShift",
  async ({ id, ShiftData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/shift/${id}`, ShiftData),
        {
          loading: " shift updating...",
          success: (res) => res.data.message || "shift updated successfully!",
          error: "Failed to update shift",
        }
      );
      // const response = await apiClient.put(`/v1/shift/${id}`, shiftData);
      // toast.success(response.data.message || "shift updated successfully");
      return response.data; // Returns the updated shift
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("shift not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "shift not found",
        });
      }
      toast.error(error.response?.data || "Failed to update shift");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update shift",
      );
    }
  },
);

// Delete a shift
export const deleteShift = createAsyncThunk(
  "shift/deleteShift",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/shift/${id}`);
      toast.success(response.data.message || "shift deleted successfully");
      return {
        data: { id },
        message: response.data.message || "shift deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete shift");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete shift",
      );
    }
  },
);

// Fetch a Single shift by ID
export const fetchShiftById = createAsyncThunk(
  "shift/fetchShiftById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/shift/${id}`);
      return response.data; // Returns the shift details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch shift",
      );
    }
  },
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
        state.shift ={...state.shift,data: [action.payload.data, ...state.shift.data]};
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
          (user) => user.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.shift.data[index] = action.payload.data;
        } else {
          state.shift ={...state.shift , data: [action.payload.data, ...state.shift.data]};
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
          (data) => data.id !== action.payload.data.id,
        );
        state.shift = {...state.shift,data:filteredData}
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
