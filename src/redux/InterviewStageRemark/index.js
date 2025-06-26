import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";
import { fetchCandidateById } from "../Candidate";

/**
 * Fetch all interview stage remark with optional filters (search, date range, pagination).
 */
export const fetchInterviewStageRemark = createAsyncThunk(
  "interviewStages/fetchInterviewStageRemark",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
        candidateId: datas?.candidate_id || "",
      };
      const response = await apiClient.get("/v1/interview-stage-remark", {
        params,
      });
      return response.data; // Returns list of interview stage remark
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch interview stage remark"
      );
    }
  }
);

/**
 * Create a new interview stage remark.
 */
export const createInterviewStageRemark = createAsyncThunk(
  "interviewStages/createInterviewStageRemark",
  async (interviewStageRemarkData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/interview-stage-remark", interviewStageRemarkData),
        {
          loading: "Creating interview stage remark...",
          success: (res) =>
            res.data.message || "interview stage remark created successfully!",
          error: "Failed to create interview stage remark",
        }
      );
      thunkAPI.dispatch(
        fetchCandidateById(interviewStageRemarkData.candidate_id)
      );
      return response.data; // Returns the newly created interview stage remark
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create interview stage remark"
      );
    }
  }
);

/**
 * Update an existing interview stage remark by ID.
 */
export const updateInterviewStageRemark = createAsyncThunk(
  "interviewStages/updateInterviewStageRemark",
  async ({ id, interviewStageRemarkData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(
          `/v1/interview-stage-remark/${id}`,
          interviewStageRemarkData
        ),
        {
          loading: "Updating interview stage remark...",
          success: (res) =>
            res.data.message || "interview stage remark updated successfully!",
          error: "Failed to update interview stage remark",
        }
      );
      return response.data; // Returns the updated interview stage remark
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "interview stage remark not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update interview stage remark"
      );
    }
  }
);

/**
 * Delete an interview stage remark by ID.
 */
export const deleteInterviewStageRemark = createAsyncThunk(
  "interviewStages/deleteInterviewStageRemark",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/interview-stage-remark/${id}`),
        {
          loading: "Deleting interview stage remark...",
          success: (res) =>
            res.data.message || "interview stage remark deleted successfully!",
          error: "Failed to delete interview stage remark",
        }
      );
      return {
        data: { id },
        message:
          response.data.message ||
          "interview stage remark deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete interview stage remark"
      );
    }
  }
);

/**
 * Fetch a single interview stage remark by ID.
 */
export const fetchInterviewStageRemarkById = createAsyncThunk(
  "interviewStages/fetchInterviewStageRemarkById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/interview-stage-remark/${id}`);
      return response.data; // Returns interview stage remark details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch interview stage remark"
      );
    }
  }
);

const interviewStageRemarkSlice = createSlice({
  name: "interviewStageRemark",
  initialState: {
    interviewStageRemark: {},
    interviewStageDetail: null,
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
      // Fetch all interview stage remark
      .addCase(fetchInterviewStageRemark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewStageRemark.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewStageRemark = action.payload.data;
      })
      .addCase(fetchInterviewStageRemark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create interview stage remark
      .addCase(createInterviewStageRemark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInterviewStageRemark.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewStageRemark = action.payload.data;
        state.success = action.payload.message;
      })
      .addCase(createInterviewStageRemark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update interview stage remark
      .addCase(updateInterviewStageRemark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInterviewStageRemark.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.interviewStageRemark.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.interviewStageRemark.data[index] = action.payload.data;
        } else {
          state.interviewStageRemark = {
            ...state.interviewStageRemark,
            data: [
              ...(state.interviewStageRemark.data || []),
              action.payload.data,
            ],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateInterviewStageRemark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete interview stage remark
      .addCase(deleteInterviewStageRemark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInterviewStageRemark.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.interviewStageRemark.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.interviewStageRemark = {
          ...state.interviewStageRemark,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteInterviewStageRemark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch interview stage remark by ID
      .addCase(fetchInterviewStageRemarkById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewStageRemarkById.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewStageDetail = action.payload.data;
      })
      .addCase(fetchInterviewStageRemarkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = interviewStageRemarkSlice.actions;
export default interviewStageRemarkSlice.reducer;
