import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";

export const fetchLoanRequest = createAsyncThunk(
  "loanRequest/fetchLoanRequest",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas.search;
      if (datas?.page) params.page = datas.page;
      if (datas?.size) params.size = datas.size;

      const response = await apiClient.get("/v1/loan-requests", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch loan requests"
      );
    }
  }
);
export const fetchLoanRequestById = createAsyncThunk(
  "loanRequest/fetchLoanRequestById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/loan-requests/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const addLoanRequest = createAsyncThunk(
  "loanRequest/addLoanRequest",
  async (loanRequestData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/loan-requests", loanRequestData),
        {
          loading: "Adding loan request...",
          success: "Loan request added successfully",
          error: "Failed to add loan request",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add loan request"
      );
    }
  }
);

export const updateLoanRequest = createAsyncThunk(
  "loanRequest/updateLoanRequest",
  async ({ id, loanRequestData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/loan-requests/${id}`, loanRequestData),
        {
          loading: "Updating loan request...",
          success: "Loan request updated successfully",
          error: "Failed to update loan request",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({ status: 404, message: "Not found" });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update loan request"
      );
    }
  }
);

export const deleteLoanRequest = createAsyncThunk(
  "loanRequest/deleteLoanRequest",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/loan-requests/${id}`),
        {
          loading: "Deleting loan request...",
          success: "Loan request deleted successfully",
          error: "Failed to delete loan request",
        }
      );

      return {
        data: { id },
        message: response.data.message || "Loan request deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete loan request"
      );
    }
  }
);

const loanRequestSlice = createSlice({
  name: "loanRequest",
  initialState: {
    loanRequest: [],
    loanRequestDetail: null,
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
      .addCase(fetchLoanRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoanRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.loanRequest = action.payload.data;
      })
      .addCase(fetchLoanRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      .addCase(addLoanRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLoanRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.loanRequest = {
          ...state.loanRequest,
          data: [action.payload.data, ...(state.loanRequest?.data || [])],
        };
        state.success = action.payload.message;
      })
      .addCase(addLoanRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      .addCase(updateLoanRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLoanRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loanRequest?.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.loanRequest.data[index] = action.payload.data;
        }
        state.success = action.payload.message;
      })
      .addCase(updateLoanRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      .addCase(deleteLoanRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLoanRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.loanRequest = {
          ...state.loanRequest,
          data: state.loanRequest.data.filter(
            (item) => item.id !== action.payload.data.id
          ),
        };
        state.success = action.payload.message;
      })
      .addCase(deleteLoanRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      .addCase(fetchLoanRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoanRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.loanRequestDetail = action.payload.data;
      })
      .addCase(fetchLoanRequestById.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { clearMessages } = loanRequestSlice.actions;
export default loanRequestSlice.reducer;
