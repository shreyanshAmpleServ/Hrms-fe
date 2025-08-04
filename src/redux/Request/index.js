import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import { toast } from "react-hot-toast";
/**
 * Fetch a single request by request type.
 */
export const fetchRequest = createAsyncThunk(
  "request/fetchRequest",
  async (params, thunkAPI) => {
    try {
      const response = await apiClient.get(
        `/v1/request-by-request-type-reference`,
        {
          params: {
            request_type: params.requestType,
            reference_id: params.referenceId,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch requests"
      );
    }
  }
);

export const getAllRequests = createAsyncThunk(
  "request/getAllRequests",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/requests-by-users`);
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
    request: null,
    requests: null,
    loading: false,
    loadingAll: false,
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
      .addCase(fetchRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.request = action.payload.data;
      })
      .addCase(fetchRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getAllRequests.pending, (state) => {
        state.loadingAll = true;
        state.error = null;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.requests = action.payload.data;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.loadingAll = false;
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
