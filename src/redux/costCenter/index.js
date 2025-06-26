import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All cost centers
export const fetchCostCenter = createAsyncThunk(
  "costCenter/fetchCostCenter",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/cost-center`);
      return response.data; // Returns a list of cost center
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch cost center"
      );
    }
  }
);

// Add a cost center
export const addCostCenter = createAsyncThunk(
  "costCenter/addCostCenter",
  async (data, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/cost-center", data),
        {
          loading: "Cost center adding...",
          success: (res) =>
            res.data.message || "Cost center added successfully!",
          error: "Failed to add cost center",
        }
      );
      // const response = await apiClient.post("/v1/cost-center", data);
      // toast.success(response.data.message || "Cost center created successfully");
      return response.data; // Returns the newly added cost center
    } catch (error) {
      toast.error(error.response?.data || "Failed to add cost center");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add cost center"
      );
    }
  }
);

// Update a cost center
export const updateCostCenter = createAsyncThunk(
  "costCenter/updateCostCenter",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/costCenter/${id}`, data),
        {
          loading: "Cost center updating...",
          success: (res) =>
            res.data.message || "Cost center updated successfully!",
          error: "Failed to update cost center",
        }
      );
      // const response = await apiClient.put(`/v1/costCenter/${id}`, data);
      // toast.success(response.data.message || "Cost center updated successfully");
      return response.data; // Returns the updated cost center
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Cost center not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Cost center not found",
        });
      }
      toast.error(error.response?.data || "Failed to update cost center");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update cost center"
      );
    }
  }
);

// Delete a cost center
export const deleteCostCenter = createAsyncThunk(
  "costCenter/deleteCostCenter",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/costCenter/${id}`);
      toast.success(
        response.data.message || "Cost center deleted successfully"
      );
      return {
        data: { id },
        message: response.data.message || "Cost center deleted successfully",
      };
    } catch (error) {
      toast.error(error.response?.data || "Failed to delete cost center");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete cost center"
      );
    }
  }
);

// Fetch a Single cost center by ID
export const fetchCostCenterById = createAsyncThunk(
  "costCenter/fetchCostCenterById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/costCenter/${id}`);
      return response.data; // Returns the cost center details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch cost center"
      );
    }
  }
);

const costCenterSlice = createSlice({
  name: "costCenter",
  initialState: {
    costCenter: [],
    costCenterDetail: null,
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCostCenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCostCenter.fulfilled, (state, action) => {
        state.loading = false;
        state.costCenter = action.payload.data;
      })
      .addCase(fetchCostCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addCostCenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCostCenter.fulfilled, (state, action) => {
        state.loading = false;
        state.costCenter = {
          ...state.costCenter,
          data: [action.payload.data, ...state.costCenter.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addCostCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateCostCenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCostCenter.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.costCenter.data?.findIndex(
          (user) => user.id === action.payload.data.id
        );
        if (index !== -1) {
          state.costCenter.data[index] = action.payload.data;
        } else {
          state.costCenter = {
            ...state.costCenter,
            data: [action.payload.data, ...state.costCenter.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateCostCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteCostCenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCostCenter.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.costCenter.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.costCenter = { ...state.costCenter, data: filteredData };
        state.success = action.payload.message;
      })
      .addCase(deleteCostCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchCostCenterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCostCenterById.fulfilled, (state, action) => {
        state.loading = false;
        state.costCenterDetail = action.payload.data;
      })
      .addCase(fetchCostCenterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = costCenterSlice.actions;
export default costCenterSlice.reducer;
