import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// tax_relief Slice

// Fetch All tax_relief
export const fetchTaxSlab = createAsyncThunk(
  "taxSlab/fetchTaxSlab",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      const response = await apiClient.get("/v1/tax-slab", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Tax slab"
      );
    }
  }
);

// Add an tax_relief
export const addTaxSlab = createAsyncThunk(
  "taxSlab/addTaxSlab",
  async (data, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/tax-slab", data),
        {
          loading: "Adding Tax slab...",
          success: "Tax slab added successfully",
          error: "Failed to add Tax slab",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add Tax slab"
      );
    }
  }
);

// Update an tax_relief
export const updateTaxSlab = createAsyncThunk(
  "taxSlab/updateTaxSlab",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/tax-slab/${id}`, data),
        {
          loading: "Updating Tax slab...",
          success: "Tax slab updated successfully",
          error: "Failed to update Tax slab",
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
        error.response?.data || "Failed to update Tax slab"
      );
    }
  }
);

// Delete an tax_relief
export const deleteTaxSlab = createAsyncThunk(
  "taxSlab/deleteTaxSlab",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/tax-slab/${id}`),
        {
          loading: "Deleting Tax slab...",
          success: "Tax slab deleted successfully",
          error: "Failed to delete Tax slab",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Tax slab deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete Tax slab"
      );
    }
  }
);

const taxSlabSlice = createSlice({
  name: "taxSlab",
  initialState: {
    taxSlab: [],
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
      .addCase(fetchTaxSlab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxSlab.fulfilled, (state, action) => {
        state.loading = false;
        state.taxSlab = action.payload.data;
      })
      .addCase(fetchTaxSlab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addTaxSlab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaxSlab.fulfilled, (state, action) => {
        state.loading = false;
        state.taxSlab = [...state.taxSlab.data, action.payload.data];
        state.success = action.payload.message;
      })
      .addCase(addTaxSlab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateTaxSlab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaxSlab.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.taxSlab?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.taxSlab[index] = action.payload.data;
        } else {
          state.taxSlab = [...state.taxSlab, action.payload.data];
        }
        state.success = action.payload.message;
      })
      .addCase(updateTaxSlab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteTaxSlab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaxSlab.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.taxSlab.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.taxSlab = filterData;
        state.success = action.payload.message;
      })
      .addCase(deleteTaxSlab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = taxSlabSlice.actions;
export default taxSlabSlice.reducer;
