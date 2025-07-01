import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// survey Slice

// Fetch All survey
export const fetchsurvey = createAsyncThunk(
  "survey/fetchsurvey",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.is_active) params.is_active = datas?.is_active;
      const response = await apiClient.get("/v1/survey", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch review-template"
      );
    }
  }
);

// Add an survey
export const addsurvey = createAsyncThunk(
  "survey/addsurvey",
  async (surveyData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/survey", surveyData),
        {
          loading: "Adding Survey...",
          success: "Survey added successfully",
          error: "Failed to add survey",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add survey"
      );
    }
  }
);

// Update an survey
export const updatesurvey = createAsyncThunk(
  "survey/updatesurvey",
  async ({ id, surveyData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/survey/${id}`, surveyData),
        {
          loading: "Updating Survey...",
          success: "Survey updated successfully",
          error: "Failed to update survey",
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
        error.response?.data || "Failed to update survey"
      );
    }
  }
);

// Delete an survey
export const deletesurvey = createAsyncThunk(
  "survey/deletesurvey",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/survey/${id}`),
        {
          loading: "Deleting Survey...",
          success: "Survey deleted successfully",
          error: "Failed to delete survey",
        }
      );
      return {
        data: { id },
        message: response.data.message || "survey deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete survey"
      );
    }
  }
);

const surveySlice = createSlice({
  name: "survey",
  initialState: {
    survey: [],
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
      .addCase(fetchsurvey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchsurvey.fulfilled, (state, action) => {
        state.loading = false;
        state.survey = action.payload.data;
      })
      .addCase(fetchsurvey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addsurvey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addsurvey.fulfilled, (state, action) => {
        state.loading = false;
        state.survey = {
          ...state.survey,
          data: [action.payload.data, ...state.survey.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addsurvey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatesurvey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatesurvey.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.survey?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.survey.data[index] = action.payload.data;
        } else {
          state.survey = {
            ...state.survey,
            data: [...state.survey, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatesurvey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletesurvey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletesurvey.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.survey.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.survey = { ...state.survey, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletesurvey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = surveySlice.actions;
export default surveySlice.reducer;
