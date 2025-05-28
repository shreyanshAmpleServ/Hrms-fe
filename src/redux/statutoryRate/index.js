import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// statutory_rates Slice

// Fetch All statutory_ratess
export const fetchstatutory_rates = createAsyncThunk(
  "statutory_rates/fetchstatutory_rates",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      const response = await apiClient.get("/v1/statutory-rate", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch statutory_ratess"
      );
    }
  }
);

// Add an statutory_rates
export const addstatutory_rates = createAsyncThunk(
  "statutory_rates/addstatutory_rates",
  async (statutory_ratesData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/statutory-rate", statutory_ratesData),
        {
          loading: "Adding statutory rates...",
          success: "Statutory rates added successfully",
          error: "Failed to add statutory rates",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add statutory rates"
      );
    }
  }
);

// Update an statutory_rates
export const updatestatutory_rates = createAsyncThunk(
  "statutory_rates/updatestatutory_rates",
  async ({ id, statutory_ratesData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/statutory-rate/${id}`, statutory_ratesData),
        {
          loading: "Updating statutory rates...",
          success: "Statutory rates updated successfully",
          error: "Failed to update statutory rates",
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
        error.response?.data || "Failed to update statutory_rates"
      );
    }
  }
);

// Delete an statutory_rates
export const deletestatutory_rates = createAsyncThunk(
  "statutory_rates/deletestatutory_rates",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/statutory-rate/${id}`),
        {
          loading: "Deleting statutory rates...",
          success: "Statutory rates deleted successfully",
          error: "Failed to delete statutory rates",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Statutory rates deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete statutory rates"
      );
    }
  }
);

const statutory_ratessSlice = createSlice({
  name: "statutory_rates",
  initialState: {
    statutory_rates: [],
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
      .addCase(fetchstatutory_rates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchstatutory_rates.fulfilled, (state, action) => {
        state.loading = false;
        state.statutory_rates = action.payload.data;
      })
      .addCase(fetchstatutory_rates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addstatutory_rates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addstatutory_rates.fulfilled, (state, action) => {
        state.loading = false;
        state.statutory_rates = {
          ...state.statutory_rates,
          data: [action.payload.data, ...state.statutory_rates.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addstatutory_rates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatestatutory_rates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatestatutory_rates.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.statutory_rates?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.statutory_rates.data[index] = action.payload.data;
        } else {
          state.statutory_rates = {
            ...state.statutory_rates,
            data: [...state.statutory_rates, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatestatutory_rates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletestatutory_rates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletestatutory_rates.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.statutory_rates.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.statutory_rates = { ...state.statutory_rates, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletestatutory_rates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = statutory_ratessSlice.actions;
export default statutory_ratessSlice.reducer;
