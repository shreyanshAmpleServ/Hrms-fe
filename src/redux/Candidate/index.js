import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all candidate with optional filters (search, date range, pagination).
 */
export const fetchCandidate = createAsyncThunk(
  "candidate/fetchCandidate",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.startDate) params.startDate = datas?.startDate?.toISOString();
      if (datas?.endDate) params.endDate = datas?.endDate?.toISOString();
      if (datas?.is_active) params.is_active = datas?.is_active;
      const response = await apiClient.get("/v1/candidate-master", {
        params,
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch candidate");
    }
  }
);

/**
 * Create a new candidate.
 */
export const createCandidate = createAsyncThunk(
  "candidate/createCandidate",
  async (candidateData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/candidate-master", candidateData),
        {
          loading: "Creating candidate...",
          success: (res) =>
            res.data.message || "candidate created successfully!",
          error: "Failed to create candidate",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to create candidate");
    }
  }
);

/**
 * Update an existing candidate by ID.
 */
export const updateCandidate = createAsyncThunk(
  "candidate/updateCandidate",
  async ({ id, candidateData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/candidate-master/${id}`, candidateData),
        {
          loading: "Updating candidate...",
          success: (res) =>
            res.data.message || "candidate updated successfully!",
          error: "Failed to update candidate",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "candidate not found",
        });
      }
      return thunkAPI.rejectWithValue("Failed to update candidate");
    }
  }
);

/**
 * Delete an candidate by ID.
 */
export const deleteCandidate = createAsyncThunk(
  "candidate/deleteCandidate",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/candidate-master/${id}`),
        {
          loading: "Deleting candidate...",
          success: (res) =>
            res.data.message || "candidate deleted successfully!",
          error: "Failed to delete candidate",
        }
      );
      return {
        data: { id },
        message: response.data.message || "candidate deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete candidate");
    }
  }
);

/**
 * Fetch a single candidate by ID.
 */
export const fetchCandidateById = createAsyncThunk(
  "candidate/fetchCandidateById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/candidate-master/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch candidate");
    }
  }
);

const candidateSlice = createSlice({
  name: "candidate",
  initialState: {
    candidate: {
      data: [],
    },
    candidateDetail: null,
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
      .addCase(fetchCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidate = action.payload.data;
      })
      .addCase(fetchCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(createCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidate = {
          ...state.candidate,
          data: [...(state.candidate.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(updateCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.candidate.data) {
          state.candidate = {
            ...state.candidate,
            data: [action.payload.data],
          };
        } else if (Array.isArray(state.candidate.data)) {
          const index = state.candidate.data.findIndex(
            (data) => data.id === action.payload.data.id
          );

          if (index !== -1 && action.payload.data) {
            state.candidate.data[index] = action.payload.data;
            state.candidateDetail = action.payload.data;
          } else if (action.payload.data) {
            state.candidateDetail = action.payload.data;
            state.candidate = {
              ...state.candidate,
              data: [...state.candidate.data, action.payload.data],
            };
          }
        }

        state.success = action.payload.message;
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(deleteCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.candidate.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.candidate = {
          ...state.candidate,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchCandidateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.loading = false;
        state.candidateDetail = action.payload.data;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = candidateSlice.actions;
export default candidateSlice.reducer;
