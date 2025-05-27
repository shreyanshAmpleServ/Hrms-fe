import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Branch Slice
 */

/**
 * Fetches all branches with optional pagination and search params
 * @param {Object} datas - Query parameters
 * @param {string} datas.search - Search text
 * @param {number} datas.page - Page number
 * @param {number} datas.size - Page size
 */
export const fetchbranch = createAsyncThunk(
  "branch/fetchbranch",
  async (data, thunkAPI) => {
    try {
      let params = {};
      if (data?.search) params.search = data?.search;
      if (data?.page) params.page = data?.page;
      if (data?.size) params.size = data?.size;

      const response = await apiClient.get("/v1/branch", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch branch"
      );
    }
  }
);

/**
 * Creates a new branch
 * @param {Object} branchData - Branch data to create
 */
export const addbranch = createAsyncThunk(
  "branch/addbranch",
  async (branchData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/branch", branchData),
        {
          loading: "Adding branch...",
          success: "Branch added successfully",
          error: "Failed to add branch",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add branch"
      );
    }
  }
);

/**
 * Updates an existing branch
 * @param {Object} params - Update parameters
 * @param {string} params.id - Branch ID
 * @param {Object} params.branchData - Updated branch data
 */
export const updatebranch = createAsyncThunk(
  "branch/updatebranch",
  async ({ id, branchData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/branch/${id}`, branchData),
        {
          loading: "Updating branch...",
          success: "Branch updated successfully",
          error: "Failed to update branch",
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
        error.response?.data || "Failed to update branch"
      );
    }
  }
);

/**
 * Deletes a branch by ID
 * @param {string} id - Branch ID to delete
 */
export const deletebranch = createAsyncThunk(
  "branch/deletebranch",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/branch/${id}`),
        {
          loading: "Deleting branch...",
          success: "Branch deleted successfully",
          error: "Failed to delete branch",
        }
      );
      return {
        data: { id },
        message: response.data.message || "branch deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete branch"
      );
    }
  }
);

const branchSlice = createSlice({
  name: "branch",
  initialState: {
    branch: [],
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
      .addCase(fetchbranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchbranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branch = action.payload.data;
      })
      .addCase(fetchbranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addbranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addbranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branch = {
          ...state.branch,
          data: [action.payload.data, ...state.branch.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addbranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatebranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatebranch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.branch?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.branch.data[index] = action.payload.data;
        } else {
          state.branch = {
            ...state.branch,
            data: [...state.branch, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatebranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletebranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletebranch.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.branch.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.branch = { ...state.branch, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletebranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = branchSlice.actions;
export default branchSlice.reducer;
