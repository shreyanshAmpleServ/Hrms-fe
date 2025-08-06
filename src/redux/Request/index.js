import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import { toast } from "react-hot-toast";

export const getAllRequests = createAsyncThunk(
  "request/getAllRequests",
  async (params, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/requests-by-users`, {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch requests"
      );
    }
  }
);
export const getPendingRequests = createAsyncThunk(
  "request/getPendingRequests",
  async (params = { status: "P" }, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/requests-by-users`, {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch requests"
      );
    }
  }
);

export const takeActionOnRequest = createAsyncThunk(
  "request/takeActionOnRequest",
  async (data, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post(`/v1/requests/action`, data),
        {
          loading: "Processing...",
          success: "Request processed successfully",
          error: "Failed to process request",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const requestSlice = createSlice({
  name: "request",
  initialState: {
    requests: null,
    pendingRequests: null,
    loading: false,
    loadingPending: false,
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
      .addCase(getAllRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.data;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getPendingRequests.pending, (state) => {
        state.loadingPending = true;
        state.error = null;
      })
      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.loadingPending = false;
        state.pendingRequests = action.payload.data;
      })
      .addCase(getPendingRequests.rejected, (state, action) => {
        state.loadingPending = false;
        state.error = action.payload.message;
      })
      .addCase(takeActionOnRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(takeActionOnRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(takeActionOnRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = requestSlice.actions;
export default requestSlice.reducer;
