import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All Currencies
export const fetchCurrencies = createAsyncThunk(
  "currencies/fetchCurrencies",
  async (data, thunkAPI) => {
    try {
      let params = {};
      if (data?.search) params.search = data?.search;
      if (data?.page) params.page = data?.page;
      if (data?.size) params.size = data?.size;
      if (data?.is_active) params.is_active = data?.is_active;

      const response = await apiClient.get("/v1/currencies", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch currencies"
      );
    }
  }
);

// Add a Currencies
export const addCurrencies = createAsyncThunk(
  "currencies/addCurrencies",
  async (CurrenciesData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/currencies", CurrenciesData),
        {
          loading: "Adding Currency...",
          success: "Currency added successfully",
          error: "Failed to add Currency",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add Currency"
      );
    }
  }
);

// Update a Currencies
export const updateCurrencies = createAsyncThunk(
  "currencies/updateCurrencies",
  async ({ id, CurrenciesData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/currencies/${id}`, CurrenciesData),
        {
          loading: "Updating Currency...",
          success: "Currency updated successfully",
          error: "Failed to update Currency",
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
        error.response?.data || "Failed to update Currency"
      );
    }
  }
);

// Delete a Currencies
export const deleteCurrencies = createAsyncThunk(
  "currencies/deleteCurrencies",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/currencies/${id}`),
        {
          loading: "Deleting Currency...",
          success: "Currency deleted successfully",
          error: "Failed to delete Currency",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Currency deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete Currency"
      );
    }
  }
);

// Fetch a Single Currencies by ID
export const fetchCurrenciesById = createAsyncThunk(
  "currencies/fetchCurrenciesById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/currencies/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Currency"
      );
    }
  }
);

const currenciesSlice = createSlice({
  name: "currencies",
  initialState: {
    currencies: [],
    CurrenciesDetail: null,
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
      .addCase(fetchCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = action.payload.data;
      })
      .addCase(fetchCurrencies.rejected, (state, _action) => {
        state.loading = false;
        // state.error = action.payload.message;
      })
      .addCase(addCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies.data = [action.payload.data, ...state.currencies.data];
        state.success = action.payload.message;
      })
      .addCase(addCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.currencies?.data?.findIndex(
          (Currencies) => Currencies.id === action.payload.data.id
        );

        if (index !== -1) {
          state.currencies.data[index] = action.payload.data;
        } else {
          state.currencies.data = [
            action.payload.data,
            ...state.currencies.data,
          ];
        }

        state.success = action.payload.message;
      })
      .addCase(updateCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies.data = state.currencies.data.filter(
          (Currencies) => Currencies.id !== action.payload.data.id
        );
        state.success = action.payload.message;
      })
      .addCase(deleteCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchCurrenciesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrenciesById.fulfilled, (state, action) => {
        state.loading = false;
        state.CurrenciesDetail = action.payload.data;
      })
      .addCase(fetchCurrenciesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = currenciesSlice.actions;
export default currenciesSlice.reducer;
