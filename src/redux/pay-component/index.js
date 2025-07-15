import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";

/**
 * @typedef {Object} PayComponentData
 * @property {string} id - The ID of the pay component
 * @property {string} [name] - The name of the pay component
 * @property {boolean} [is_active] - Whether the pay component is active
 * @property {boolean} [is_advance] - Whether the pay component is an advance payment
 */

/**
 * Fetch all pay components with optional filtering
 * @param {Object} datas - Query parameters
 * @param {string} [datas.search] - Search term
 * @param {number} [datas.page] - Page number
 * @param {number} [datas.size] - Page size
 * @param {boolean} [datas.is_active] - Filter by active status
 * @param {boolean} [datas.is_advance] - Filter by advance payment status
 * @returns {Promise<{data: PayComponentData[], message: string}>}
 */
export const fetchpay_component = createAsyncThunk(
  "pay_component/fetchpay_component",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.is_active) params.is_active = datas?.is_active;
      if (datas?.is_advance) params.is_advance = datas?.is_advance;

      const response = await apiClient.get("/v1/pay-component", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch pay_components"
      );
    }
  }
);

export const componentOptionsFn = createAsyncThunk(
  "pay_component/componentOptionsFn",
  async (params, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/pay-component-options", {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Add a new pay component
 * @param {PayComponentData} pay_componentData - Pay component data to add
 * @returns {Promise<{data: PayComponentData, message: string}>}
 */
export const addpay_component = createAsyncThunk(
  "pay_component/addpay_component",
  async (pay_componentData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/pay-component", pay_componentData),
        {
          loading: "Adding Pay Component...",
          success: "Pay Component added successfully",
          error: (error) =>
            error?.response?.data?.message || "Failed to create pay Component",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/**
 * Update an existing pay component
 * @param {Object} params - Update parameters
 * @param {string} params.id - ID of the pay component to update
 * @param {PayComponentData} params.pay_componentData - Updated pay component data
 * @returns {Promise<{data: PayComponentData, message: string}>}
 */
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

/**
 * Delete a pay component by ID
 * @param {string} id - ID of the pay component to delete
 * @returns {Promise<{data: {id: string}, message: string}>}
 */
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

/**
 * Redux slice for pay component management
 */
const pay_componentsSlice = createSlice({
  name: "pay_component",
  initialState: {
    pay_component: [],
    componentOptions: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    /**
     * Clear error and success messages
     * @param {Object} state - Current state
     */
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
      })
      .addCase(componentOptionsFn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(componentOptionsFn.fulfilled, (state, action) => {
        state.loading = false;
        state.componentOptions = action.payload.data;
      })
      .addCase(componentOptionsFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = pay_componentsSlice.actions;
export default pay_componentsSlice.reducer;
