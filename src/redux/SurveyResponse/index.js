import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all survey response with optional filters (search, date range, pagination).
 */
export const fetchSurveyResponse = createAsyncThunk(
  "surveyResponse/fetchSurveyResponse",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || 1,
        size: datas?.size || 10,
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/survey-response", {
        params,
      });
      return response.data; // Returns list of survey response
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch survey response"
      );
    }
  }
);

/**
 * Create a new survey response.
 */
export const createSurveyResponse = createAsyncThunk(
  "surveyResponse/createSurveyResponse",
  async (surveyResponseData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/survey-response", surveyResponseData),
        {
          loading: "Creating survey response...",
          success: (res) =>
            res.data.message || "Survey response created successfully!",
          error: "Failed to create survey response",
        }
      );
      return response.data; // Returns the newly created survey response
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create survey response"
      );
    }
  }
);

/**
 * Update an existing survey response by ID.
 */
export const updateSurveyResponse = createAsyncThunk(
  "surveyResponse/updateSurveyResponse",
  async ({ id, surveyResponseData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/survey-response/${id}`, surveyResponseData),
        {
          loading: "Updating survey response...",
          success: (res) =>
            res.data.message || "Survey response updated successfully!",
          error: "Failed to update survey response",
        }
      );
      return response.data; // Returns the updated survey response
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Survey response not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update survey response"
      );
    }
  }
);

/**
 * Delete an survey response by ID.
 */
export const deleteSurveyResponse = createAsyncThunk(
  "surveyResponse/deleteSurveyResponse",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/survey-response/${id}`),
        {
          loading: "Deleting survey response...",
          success: (res) =>
            res.data.message || "Survey response deleted successfully!",
          error: "Failed to delete survey response",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Survey response deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete survey response"
      );
    }
  }
);

/**
 * Fetch a single survey response by ID.
 */
export const fetchSurveyResponseById = createAsyncThunk(
  "surveyResponse/fetchSurveyResponseById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/survey-response/${id}`);
      return response.data; // Returns survey response details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch survey response"
      );
    }
  }
);

const surveyResponseSlice = createSlice({
  name: "surveyResponse",
  initialState: {
    surveyResponse: {},
    surveyResponseDetail: null,
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
      // Fetch all survey response
      .addCase(fetchSurveyResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurveyResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.surveyResponse = action.payload.data;
      })
      .addCase(fetchSurveyResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create survey response
      .addCase(createSurveyResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSurveyResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.surveyResponse = {
          ...state.surveyResponse,
          data: [...(state.surveyResponse.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createSurveyResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update survey response
      .addCase(updateSurveyResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSurveyResponse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.surveyResponse.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.surveyResponse.data[index] = action.payload.data;
        } else {
          state.surveyResponse = {
            ...state.surveyResponse,
            data: [...(state.surveyResponse.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateSurveyResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete survey response
      .addCase(deleteSurveyResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSurveyResponse.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.surveyResponse.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.surveyResponse = {
          ...state.surveyResponse,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteSurveyResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch survey response by ID
      .addCase(fetchSurveyResponseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurveyResponseById.fulfilled, (state, action) => {
        state.loading = false;
        state.surveyResponseDetail = action.payload.data;
      })
      .addCase(fetchSurveyResponseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = surveyResponseSlice.actions;
export default surveyResponseSlice.reducer;
