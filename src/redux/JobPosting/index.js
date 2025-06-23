import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

export const fetchJobPosting = createAsyncThunk(
  "JobPosting/fetchJobPosting",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/job-posting", {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Job Posting"
      );
    }
  }
);

export const createJobPosting = createAsyncThunk(
  "JobPosting/createJobPosting",
  async (JobPostingData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/job-posting", JobPostingData),
        {
          loading: "Creating JobPosting...",
          success: (res) =>
            res.data.message || "Job Posting created successfully!",
          error: "Failed to create JobPosting",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create JobPosting"
      );
    }
  }
);

export const updateJobPosting = createAsyncThunk(
  "JobPosting/updateJobPosting",
  async ({ id, JobPostingData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/job-posting/${id}`, JobPostingData),
        {
          loading: "Updating JobPosting...",
          success: (res) =>
            res.data.message || "JobPosting updated successfully!",
          error: "Failed to update JobPosting",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "JobPosting not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update JobPosting"
      );
    }
  }
);

export const deleteJobPosting = createAsyncThunk(
  "JobPosting/deleteJobPosting",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/job-posting/${id}`),
        {
          loading: "Deleting JobPosting...",
          success: (res) =>
            res.data.message || "Job Posting deleted successfully!",
          error: "Failed to delete JobPosting",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Job Posting deleted successfully!",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete JobPosting"
      );
    }
  }
);

export const fetchJobPostingById = createAsyncThunk(
  "JobPosting/fetchJobPostingById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/job-posting/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch JobPosting"
      );
    }
  }
);

const JobPostingSlice = createSlice({
  name: "JobPosting",
  initialState: {
    JobPosting: {},
    JobPostingDetail: null,
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
      .addCase(fetchJobPosting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobPosting.fulfilled, (state, action) => {
        state.loading = false;
        state.JobPosting = action.payload.data;
      })
      .addCase(fetchJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(createJobPosting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobPosting.fulfilled, (state, action) => {
        state.loading = false;
        state.JobPosting = {
          ...state.JobPosting,
          data: [...(state.JobPosting.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(updateJobPosting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobPosting.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.JobPosting.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.JobPosting.data[index] = action.payload.data;
        } else {
          state.JobPosting = {
            ...state.JobPosting,
            data: [...(state.JobPosting.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(deleteJobPosting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJobPosting.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.JobPosting.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.JobPosting = {
          ...state.JobPosting,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(fetchJobPostingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobPostingById.fulfilled, (state, action) => {
        state.loading = false;
        state.JobPostingDetail = action.payload.data;
      })
      .addCase(fetchJobPostingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = JobPostingSlice.actions;
export default JobPostingSlice.reducer;
