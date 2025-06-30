import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";

// pay_component Slice

// Fetch All pay_components
export const fetchpay_component = createAsyncThunk(
  "pay_component/fetchpay_component",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/pay-component", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch pay_components"
      );
    }
  }
);

// Add an pay_component
export const addpay_component = createAsyncThunk(
  "pay_component/addpay_component",
  async (pay_componentData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/pay-component", pay_componentData),
        {
          loading: "Adding Pay Component...",
          success: "Pay Component added successfully",
          error: "Failed to add Pay Component",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add Pay Component"
      );
    }
  }
);

// Update an pay_component
export const updatepay_component = createAsyncThunk(
  "pay_component/updatepay_component",
  async ({ id, pay_componentData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/pay-component/${id}`, pay_componentData),
        {
          loading: "Updating Pay Component...",
          success: "Pay Component updated successfully",
          error: "Failed to update Pay Component",
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
        error.response?.data || "Failed to update pay_component"
      );
    }
  }
);

// Delete an pay_component
export const deletepay_component = createAsyncThunk(
  "pay_component/deletepay_component",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/pay-component/${id}`),
        {
          loading: "Deleting Pay Component...",
          success: "Pay Component deleted successfully",
          error: "Failed to delete Pay Component",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Pay Component deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete Pay Component"
      );
    }
  }
);

const pay_componentsSlice = createSlice({
  name: "pay_component",
  initialState: {
    pay_component: [],
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
      .addCase(fetchpay_component.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchpay_component.fulfilled, (state, action) => {
        state.loading = false;
        state.pay_component = action.payload.data;
      })
      .addCase(fetchpay_component.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addpay_component.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addpay_component.fulfilled, (state, action) => {
        state.loading = false;
        if (state.pay_component.data) {
          state.pay_component = {
            ...state.pay_component,
            data: [action.payload.data, ...state.pay_component.data],
          };
          state.success = action.payload.message;
        } else {
          state.pay_component = {
            ...state.pay_component,
            data: [action.payload.data],
          };
          state.success = action.payload.message;
        }
      })
      .addCase(addpay_component.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatepay_component.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatepay_component.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pay_component?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.pay_component.data[index] = action.payload.data;
        } else {
          state.pay_component = {
            ...state.pay_component,
            data: [...state.pay_component, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatepay_component.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletepay_component.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletepay_component.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.pay_component.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.pay_component = { ...state.pay_component, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletepay_component.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = pay_componentsSlice.actions;
export default pay_componentsSlice.reducer;
