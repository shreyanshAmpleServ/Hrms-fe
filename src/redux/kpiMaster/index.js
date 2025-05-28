import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

export const fetchkpi = createAsyncThunk(
  "kpi/fetchkpi",
  async (data, thunkAPI) => {
    const params = {};
    if (data?.search) params.search = data?.search;
    if (data?.page) params.page = data?.page;
    if (data?.size) params.size = data?.size;
    try {
      const response = await apiClient.get("/v1/kpi", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch kpi"
      );
    }
  }
);

// Add an kpi

export const addkpi = createAsyncThunk(
  "kpi/addkpi",
  async (kpiData, thunkAPI) => {
    try {
      const response = await toast.promise(apiClient.post("/v1/kpi", kpiData), {
        loading: "Adding KPI...",
        success: "KPI added successfully",
        error: "Failed to add KPI",
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add kpi"
      );
    }
  }
);

// Update an kpi
export const updatekpi = createAsyncThunk(
  "kpi/updatekpi",
  async ({ id, kpiData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/kpi/${id}`, kpiData),
        {
          loading: "Updating KPI...",
          success: "KPI updated successfully",
          error: "Failed to update KPI",
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
        error.response?.data || "Failed to update kpi"
      );
    }
  }
);

// Delete an kpi
export const deletekpi = createAsyncThunk(
  "kpi/deletekpi",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(apiClient.delete(`/v1/kpi/${id}`), {
        loading: "Deleting KPI...",
        success: "KPI deleted successfully",
        error: "Failed to delete KPI",
      });
      return {
        data: { id },
        message: response.data.message || "kpi deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete kpi"
      );
    }
  }
);

const kpiSlice = createSlice({
  name: "kpi",
  initialState: {
    kpi: {},
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
      .addCase(fetchkpi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchkpi.fulfilled, (state, action) => {
        state.loading = false;
        state.kpi = action.payload.data;
      })
      .addCase(fetchkpi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addkpi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addkpi.fulfilled, (state, action) => {
        state.loading = false;
        state.kpi.data = [action.payload.data, ...state.kpi.data];
        state.success = action.payload.message;
      })
      .addCase(addkpi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatekpi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatekpi.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.kpi?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.kpi.data[index] = action.payload.data;
        } else {
          state.kpi.data = [action.payload.data, ...state.kpi.data];
        }
        state.success = action.payload.message;
      })
      .addCase(updatekpi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletekpi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletekpi.fulfilled, (state, action) => {
        state.loading = false;
        const filteredData = state.kpi.data.filter(
          (kpi) => kpi.id !== action.payload.data.id
        );
        state.kpi.data = filteredData;

        state.success = action.payload.message;
      })
      .addCase(deletekpi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = kpiSlice.actions;
export default kpiSlice.reducer;
