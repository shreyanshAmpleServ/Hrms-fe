import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// payslip Slice

// Fetch All payslip
export const fetchpayslip = createAsyncThunk(
  "payslip/fetchpayslip",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/payslip", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch payslip"
      );
    }
  }
);

// Add an payslip
export const createpayslip = createAsyncThunk(
  "payslip/createpayslip",
  async (payslipData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/payslip", payslipData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add payslip"
      );
    }
  }
);

// Update an payslip
export const updatepayslip = createAsyncThunk(
  "payslip/updatepayslip",
  async ({ id, payslipData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/payslip/${id}`, payslipData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update payslip"
      );
    }
  }
);

// Delete an payslip
export const deletepayslip = createAsyncThunk(
  "payslip/deletepayslip",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/payslip/${id}`);
      return {
        data: { id },
        message: response.data.message || "payslip deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete payslip"
      );
    }
  }
);

const payslipSlice = createSlice({
  name: "payslip",
  initialState: {
    payslip: [],
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
      .addCase(fetchpayslip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchpayslip.fulfilled, (state, action) => {
        state.loading = false;
        state.payslip = action.payload.data;
      })
      .addCase(fetchpayslip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createpayslip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createpayslip.fulfilled, (state, action) => {
        state.loading = false;
        state.payslip = {
          ...state.payslip,
          data: [action.payload.data, ...state.payslip.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createpayslip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatepayslip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatepayslip.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payslip?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.payslip.data[index] = action.payload.data;
        } else {
          state.payslip = {
            ...state.payslip,
            data: [...state.payslip, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatepayslip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletepayslip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletepayslip.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.payslip.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.payslip = { ...state.payslip, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletepayslip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = payslipSlice.actions;
export default payslipSlice.reducer;
