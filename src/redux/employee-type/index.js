import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// employmentType Slice

// Fetch All employmentTypes
export const fetchemploymentType = createAsyncThunk(
  "employmentType/fetchemploymentType",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/employment-type", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employmentTypes"
      );
    }
  }
);

// Add an employmentType
export const addemploymentType = createAsyncThunk(
  "employmentType/addemploymentType",
  async (employmentTypeData, thunkAPI) => {
    try {
      const response = await apiClient.post(
        "/v1/employment-type",
        employmentTypeData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add employmentType"
      );
    }
  }
);

// Update an employmentType
export const updateemploymentType = createAsyncThunk(
  "employmentType/updateemploymentType",
  async ({ id, employmentTypeData }, thunkAPI) => {
    try {
      const response = await apiClient.put(
        `/v1/employment-type/${id}`,
        employmentTypeData
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
        error.response?.data || "Failed to update employmentType"
      );
    }
  }
);

// Delete an employmentType
export const deleteemploymentType = createAsyncThunk(
  "employmentType/deleteemploymentType",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/employment-type/${id}`);
      return {
        data: { id },
        message: response.data.message || "employmentType deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete employmentType"
      );
    }
  }
);

const employmentTypeSlice = createSlice({
  name: "employmentType",
  initialState: {
    employmentType: [],
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
      .addCase(fetchemploymentType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchemploymentType.fulfilled, (state, action) => {
        state.loading = false;
        state.employmentType = action.payload.data;
      })
      .addCase(fetchemploymentType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addemploymentType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addemploymentType.fulfilled, (state, action) => {
        state.loading = false;
        state.employmentType = {
          ...state.employmentType,
          data: [action.payload.data, ...state.employmentType.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addemploymentType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateemploymentType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateemploymentType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employmentType?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.employmentType.data[index] = action.payload.data;
        } else {
          state.employmentType = {
            ...state.employmentType,
            data: [...state.employmentType, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateemploymentType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteemploymentType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteemploymentType.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.employmentType.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.employmentType = {
          ...state.employmentType.data,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteemploymentType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = employmentTypeSlice.actions;
export default employmentTypeSlice.reducer;
