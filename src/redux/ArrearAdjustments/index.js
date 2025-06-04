import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all arrear adjustments with optional filters (search, date range, pagination).
 */
export const fetchArrearAdjustments = createAsyncThunk(
  "arrearAdjustments/fetchArrearAdjustments",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/arrear-adjustment", {
        params,
      });
      return response.data; // Returns list of arrear adjustments
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch arrear adjustments"
      );
    }
  }
);

/**
 * Create a new arrear adjustments.
 */
export const createArrearAdjustments = createAsyncThunk(
  "arrearAdjustments/createArrearAdjustments",
  async (arrearAdjustmentsData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/arrear-adjustment", arrearAdjustmentsData),
        {
          loading: "Creating arrear adjustments...",
          success: (res) =>
            res.data.message || "Arrear adjustments created successfully!",
          error: "Failed to create arrear adjustments",
        }
      );
      return response.data; // Returns the newly created arrear adjustments
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create arrear adjustments"
      );
    }
  }
);

/**
 * Update an existing arrear adjustments by ID.
 */
export const updateArrearAdjustments = createAsyncThunk(
  "arrearAdjustments/updateArrearAdjustments",
  async ({ id, arrearAdjustmentsData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/arrear-adjustment/${id}`, arrearAdjustmentsData),
        {
          loading: "Updating arrear adjustments...",
          success: (res) =>
            res.data.message || "Arrear adjustments updated successfully!",
          error: "Failed to update arrear adjustments",
        }
      );
      return response.data; // Returns the updated arrear adjustments
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Arrear adjustments not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update arrear adjustments"
      );
    }
  }
);

/**
 * Delete an arrear adjustments by ID.
 */
export const deleteArrearAdjustments = createAsyncThunk(
  "arrearAdjustments/deleteArrearAdjustments",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/arrear-adjustment/${id}`),
        {
          loading: "Deleting arrear adjustments...",
          success: (res) =>
            res.data.message || "Arrear adjustments deleted successfully!",
          error: "Failed to delete arrear adjustments",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Arrear adjustments deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete arrear adjustments"
      );
    }
  }
);

/**
 * Fetch a single arrear adjustments by ID.
 */
export const fetchArrearAdjustmentsById = createAsyncThunk(
  "arrearAdjustments/fetchArrearAdjustmentsById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/arrear-adjustment/${id}`);
      return response.data; // Returns arrear adjustments details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch arrear adjustments"
      );
    }
  }
);

const arrearAdjustmentsSlice = createSlice({
  name: "arrearAdjustments",
  initialState: {
    arrearAdjustments: {},
    arrearAdjustmentsDetail: null,
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
      // Fetch all arrear adjustments
      .addCase(fetchArrearAdjustments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArrearAdjustments.fulfilled, (state, action) => {
        state.loading = false;
        state.arrearAdjustments = action.payload.data;
      })
      .addCase(fetchArrearAdjustments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create arrear adjustments
      .addCase(createArrearAdjustments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArrearAdjustments.fulfilled, (state, action) => {
        state.loading = false;
        state.arrearAdjustments = {
          ...state.arrearAdjustments,
          data: [...(state.arrearAdjustments.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createArrearAdjustments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update arrear adjustments
      .addCase(updateArrearAdjustments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArrearAdjustments.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.arrearAdjustments.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.arrearAdjustments.data[index] = action.payload.data;
        } else {
          state.arrearAdjustments = {
            ...state.arrearAdjustments,
            data: [
              ...(state.arrearAdjustments.data || []),
              action.payload.data,
            ],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateArrearAdjustments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete arrear adjustments
      .addCase(deleteArrearAdjustments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArrearAdjustments.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.arrearAdjustments.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.arrearAdjustments = {
          ...state.arrearAdjustments,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteArrearAdjustments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch arrear adjustments by ID
      .addCase(fetchArrearAdjustmentsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArrearAdjustmentsById.fulfilled, (state, action) => {
        state.loading = false;
        state.arrearAdjustmentsDetail = action.payload.data;
      })
      .addCase(fetchArrearAdjustmentsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = arrearAdjustmentsSlice.actions;
export default arrearAdjustmentsSlice.reducer;
