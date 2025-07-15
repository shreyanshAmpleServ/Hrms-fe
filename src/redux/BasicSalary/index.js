import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all basic salary with optional filters (search, date range, pagination).
 */
export const fetchBasicSalary = createAsyncThunk(
  "basicSalary/fetchBasicSalary",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
        employee_id: datas?.employee_id || "",
      };
      const response = await apiClient.get("/v1/basic-pay", {
        params,
      });
      return response.data; // Returns list of basic salary
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch basic salary"
      );
    }
  }
);

/**
 * Create a new basic salary.
 */
export const createBasicSalary = createAsyncThunk(
  "basicSalary/createBasicSalary",
  async (basicSalaryData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/basic-pay", basicSalaryData),
        {
          loading: "Creating basic salary...",
          success: (res) =>
            res.data.message || "basic salary created successfully!",
          error: (error) =>
            error.response.data.message || "Failed to create basic salary",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

/**
 * Update an existing basic salary by ID.
 */
export const updateBasicSalary = createAsyncThunk(
  "basicSalary/updateBasicSalary",
  async ({ id, basicSalaryData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/basic-pay/${id}`, basicSalaryData),
        {
          loading: "Updating basic salary...",
          success: (res) =>
            res.data.message || "basic salary updated successfully!",
          error: "Failed to update basic salary",
        }
      );
      return response.data; // Returns the updated basic salary
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "basic salary not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update basic salary"
      );
    }
  }
);

/**
 * Delete an basic salary by ID.
 */
export const deleteBasicSalary = createAsyncThunk(
  "basicSalary/deleteBasicSalary",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/basic-pay/${id}`),
        {
          loading: "Deleting basic salary...",
          success: (res) =>
            res.data.message || "basic salary deleted successfully!",
          error: "Failed to delete basic salary",
        }
      );
      return {
        data: { id },
        message: response.data.message || "basic salary deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete basic salary"
      );
    }
  }
);

/**
 * Fetch a single basic salary by ID.
 */
export const fetchBasicSalaryById = createAsyncThunk(
  "basicSalary/fetchBasicSalaryById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/basic-pay/${id}`);
      return response.data; // Returns basic salary details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch basic salary"
      );
    }
  }
);

const basicSalarySlice = createSlice({
  name: "basicSalary",
  initialState: {
    basicSalary: {},
    basicSalaryDetail: null,
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
      // Fetch all basic salary
      .addCase(fetchBasicSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBasicSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.basicSalary = action.payload.data;
      })
      .addCase(fetchBasicSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create basic salary
      .addCase(createBasicSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBasicSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.basicSalary = {
          ...state.basicSalary,
          data: [...(state.basicSalary.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createBasicSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update basic salary
      .addCase(updateBasicSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBasicSalary.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.basicSalary.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.basicSalary.data[index] = action.payload.data;
        } else {
          state.basicSalary = {
            ...state.basicSalary,
            data: [...(state.basicSalary.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateBasicSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete basic salary
      .addCase(deleteBasicSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBasicSalary.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.basicSalary.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.basicSalary = {
          ...state.basicSalary,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteBasicSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch basic salary by ID
      .addCase(fetchBasicSalaryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBasicSalaryById.fulfilled, (state, action) => {
        state.loading = false;
        state.basicSalaryDetail = action.payload.data;
      })
      .addCase(fetchBasicSalaryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = basicSalarySlice.actions;
export default basicSalarySlice.reducer;
