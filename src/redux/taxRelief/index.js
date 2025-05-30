import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// tax_relief Slice

// Fetch All tax_relief
export const fetchtax_relief = createAsyncThunk(
  "tax_relief/fetchtax_relief",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      const response = await apiClient.get("/v1/tax-relief", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Tax Relief"
      );
    }
  }
);

// Add an tax_relief
export const addtax_relief = createAsyncThunk(
  "tax_relief/addtax_relief",
  async (tax_reliefData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/tax-relief", tax_reliefData),
        {
          loading: "Adding Tax Relief...",
          success: "Tax Relief added successfully",
          error: "Failed to add Tax Relief",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add Tax Relief"
      );
    }
  }
);

// Update an tax_relief
export const updatetax_relief = createAsyncThunk(
  "tax_relief/updatetax_relief",
  async ({ id, tax_reliefData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/tax-relief/${id}`, tax_reliefData),
        {
          loading: "Updating Tax Relief...",
          success: "Tax Relief updated successfully",
          error: "Failed to update Tax Relief",
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
        error.response?.data || "Failed to update Tax Relief"
      );
    }
  }
);

// Delete an tax_relief
export const deletetax_relief = createAsyncThunk(
  "tax_relief/deletetax_relief",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/tax-relief/${id}`),
        {
          loading: "Deleting Tax Relief...",
          success: "Tax Relief deleted successfully",
          error: "Failed to delete Tax Relief",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Tax Relief deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete Tax Relief"
      );
    }
  }
);

const tax_reliefSlice = createSlice({
  name: "tax_relief",
  initialState: {
    tax_relief: [],
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
      .addCase(fetchtax_relief.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchtax_relief.fulfilled, (state, action) => {
        state.loading = false;
        state.tax_relief = action.payload.data;
      })
      .addCase(fetchtax_relief.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addtax_relief.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addtax_relief.fulfilled, (state, action) => {
        state.loading = false;
        state.tax_relief = {
          ...state.tax_relief,
          data: [action.payload.data, ...state.tax_relief.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addtax_relief.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatetax_relief.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatetax_relief.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tax_relief?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.tax_relief.data[index] = action.payload.data;
        } else {
          state.tax_relief = {
            ...state.tax_relief,
            data: [...state.tax_relief, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatetax_relief.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletetax_relief.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletetax_relief.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.tax_relief.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.tax_relief = { ...state.tax_relief, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletetax_relief.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = tax_reliefSlice.actions;
export default tax_reliefSlice.reducer;
