import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// job_category Slice

// Fetch All job_category
export const fetchjob_category = createAsyncThunk(
  "job_category/fetchjob_category",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/job-category", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch review-template"
      );
    }
  }
);

// Add an job_category
export const addjob_category = createAsyncThunk(
  "job_category/addjob_category",
  async (job_categoryData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/job-category", job_categoryData),
        {
          loading: "Adding job category...",
          success: "Job category added successfully",
          error: "Failed to add job category",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add job_category"
      );
    }
  }
);

// Update an job_category
export const updatejob_category = createAsyncThunk(
  "job_category/updatejob_category",
  async ({ id, job_categoryData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/job-category/${id}`, job_categoryData),
        {
          loading: "Updating job category...",
          success: "Job category updated successfully",
          error: "Failed to update job category",
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
        error.response?.data || "Failed to update job_category"
      );
    }
  }
);

// Delete an job_category
export const deletejob_category = createAsyncThunk(
  "job_category/deletejob_category",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/job-category/${id}`),
        {
          loading: "Deleting job category...",
          success: "Job category deleted successfully",
          error: "Failed to delete job category",
        }
      );
      return {
        data: { id },
        message: response.data.message || "job_category deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete job_category"
      );
    }
  }
);

const job_categorySlice = createSlice({
  name: "job_category",
  initialState: {
    job_category: [],
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
      .addCase(fetchjob_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchjob_category.fulfilled, (state, action) => {
        state.loading = false;
        state.job_category = action.payload.data;
      })
      .addCase(fetchjob_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addjob_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addjob_category.fulfilled, (state, action) => {
        state.loading = false;
        state.job_category = {
          ...state.job_category,
          data: [action.payload.data, ...state.job_category.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addjob_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatejob_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatejob_category.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.job_category?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.job_category.data[index] = action.payload.data;
        } else {
          state.job_category = {
            ...state.job_category,
            data: [...state.job_category, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatejob_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletejob_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletejob_category.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.job_category.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.job_category = { ...state.job_category, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletejob_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = job_categorySlice.actions;
export default job_categorySlice.reducer;
