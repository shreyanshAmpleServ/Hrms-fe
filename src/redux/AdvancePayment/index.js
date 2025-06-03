import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all advance payment with optional filters (search, date range, pagination).
 */
export const fetchAdvancePayment = createAsyncThunk(
  "advancePayment/fetchAdvancePayment",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/advance-payment", {
        params,
      });
      return response.data; // Returns list of advance payment
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch advance payment"
      );
    }
  }
);

/**
 * Create a new advance payment.
 */
export const createAdvancePayment = createAsyncThunk(
  "advancePayment/createAdvancePayment",
  async (advancePaymentData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/advance-payment", advancePaymentData),
        {
          loading: "Creating advance payment...",
          success: (res) =>
            res.data.message || "Advance payment created successfully!",
          error: "Failed to create advance payment",
        }
      );
      return response.data; // Returns the newly created advance payment
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create advance payment"
      );
    }
  }
);

/**
 * Update an existing advance payment by ID.
 */
export const updateAdvancePayment = createAsyncThunk(
  "advancePayment/updateAdvancePayment",
  async ({ id, advancePaymentData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/advance-payment/${id}`, advancePaymentData),
        {
          loading: "Updating advance payment...",
          success: (res) =>
            res.data.message || "Advance payment updated successfully!",
          error: "Failed to update advance payment",
        }
      );
      return response.data; // Returns the updated advance payment
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Advance payment not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update advance payment"
      );
    }
  }
);

/**
 * Delete an advance payment by ID.
 */
export const deleteAdvancePayment = createAsyncThunk(
  "advancePayment/deleteAdvancePayment",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/advance-payment/${id}`),
        {
          loading: "Deleting advance payment...",
          success: (res) =>
            res.data.message || "Advance payment deleted successfully!",
          error: "Failed to delete advance payment",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Advance payment deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete advance payment"
      );
    }
  }
);

/**
 * Fetch a single advance payment by ID.
 */
export const fetchAdvancePaymentById = createAsyncThunk(
  "advancePayment/fetchAdvancePaymentById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/advance-payment/${id}`);
      return response.data; // Returns advance payment details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch advance payment"
      );
    }
  }
);

const advancePaymentSlice = createSlice({
  name: "advancePayment",
  initialState: {
    advancePayment: {},
    advancePaymentDetail: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    // Clear success and error messages
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all advance payment
      .addCase(fetchAdvancePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvancePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.advancePayment = action.payload.data;
      })
      .addCase(fetchAdvancePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create advance payment
      .addCase(createAdvancePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdvancePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.advancePayment = {
          ...state.advancePayment,
          data: [...(state.advancePayment.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createAdvancePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update advance payment
      .addCase(updateAdvancePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdvancePayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.advancePayment.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.advancePayment.data[index] = action.payload.data;
        } else {
          state.advancePayment = {
            ...state.advancePayment,
            data: [...(state.advancePayment.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateAdvancePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete advance payment
      .addCase(deleteAdvancePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdvancePayment.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.advancePayment.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.advancePayment = {
          ...state.advancePayment,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteAdvancePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch advance payment by ID
      .addCase(fetchAdvancePaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvancePaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.advancePaymentDetail = action.payload.data;
      })
      .addCase(fetchAdvancePaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = advancePaymentSlice.actions;
export default advancePaymentSlice.reducer;
