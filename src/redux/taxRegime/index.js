import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

export const fetchtax_Regime = createAsyncThunk(
  "tax_Regime/fetchtax_Regime",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/tax-Regime", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch tax_Regime"
      );
    }
  }
);

// Add an tax_Regime
export const addtax_Regime = createAsyncThunk(
  "tax_Regime/addtax_Regime",
  async (tax_RegimeData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/tax-Regime", tax_RegimeData),
        {
          loading: "Adding Tax Regime...",
          success: "Tax Regime added successfully",
          error: "Failed to add Tax Regime",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add Tax Regime"
      );
    }
  }
);

// Update an tax_Regime
export const updatetax_Regime = createAsyncThunk(
  "tax_Regime/updatetax_Regime",
  async ({ id, tax_RegimeData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/tax-Regime/${id}`, tax_RegimeData),
        {
          loading: "Updating Tax Regime...",
          success: "Tax Regime updated successfully",
          error: "Failed to update Tax Regime",
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
        error.response?.data || "Failed to update Tax Regime"
      );
    }
  }
);

// Delete an tax_Regime
export const deletetax_Regime = createAsyncThunk(
  "tax_Regime/deletetax_Regime",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/tax-Regime/${id}`),
        {
          loading: "Deleting Tax Regime...",
          success: "Tax Regime deleted successfully",
          error: "Failed to delete Tax Regime",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Tax Regime deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete Tax Regime"
      );
    }
  }
);

const tax_RegimeSlice = createSlice({
  name: "tax_Regime",
  initialState: {
    tax_Regime: [],
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
      .addCase(fetchtax_Regime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchtax_Regime.fulfilled, (state, action) => {
        state.loading = false;
        state.tax_Regime = action.payload.data;
      })
      .addCase(fetchtax_Regime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addtax_Regime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addtax_Regime.fulfilled, (state, action) => {
        state.loading = false;
        state.tax_Regime = {
          ...state.tax_Regime,
          data: [action.payload.data, ...state.tax_Regime.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addtax_Regime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatetax_Regime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatetax_Regime.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tax_Regime?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.tax_Regime.data[index] = action.payload.data;
        } else {
          state.tax_Regime = {
            ...state.tax_Regime,
            data: [...state.tax_Regime, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatetax_Regime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletetax_Regime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletetax_Regime.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.tax_Regime.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.tax_Regime = { ...state.tax_Regime, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletetax_Regime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = tax_RegimeSlice.actions;
export default tax_RegimeSlice.reducer;
