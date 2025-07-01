import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// letterType Slice

// Fetch All letterType
export const fetchlatter_type = createAsyncThunk(
  "latter_type/fetchlatter_type",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.is_active) params.is_active = datas?.is_active;
      const response = await apiClient.get("/v1/latter-type", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch review-template"
      );
    }
  }
);

// Add an latter_type
export const addlatter_type = createAsyncThunk(
  "latter_type/addlatter_type",
  async (latter_typeData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/latter-type", latter_typeData),
        {
          loading: "Adding letter type...",
          success: "Letter type added successfully",
          error: "Failed to add letter type",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add latter_type"
      );
    }
  }
);

// Update an latter_type
export const updatelatter_type = createAsyncThunk(
  "latter_type/updatelatter_type",
  async ({ id, latter_typeData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/latter-type/${id}`, latter_typeData),
        {
          loading: "Updating letter type...",
          success: "Letter type updated successfully",
          error: "Failed to update letter type",
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
        error.response?.data || "Failed to update latter_type"
      );
    }
  }
);

// Delete an latter_type
export const deletelatter_type = createAsyncThunk(
  "latter_type/deletelatter_type",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/latter-type/${id}`),
        {
          loading: "Deleting letter type...",
          success: "Letter type deleted successfully",
          error: "Failed to delete letter type",
        }
      );
      return {
        data: { id },
        message: response.data.message || "latter_type deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete latter_type"
      );
    }
  }
);

const latter_typeSlice = createSlice({
  name: "latter_type",
  initialState: {
    latter_type: [],
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
      .addCase(fetchlatter_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchlatter_type.fulfilled, (state, action) => {
        state.loading = false;
        state.latter_type = action.payload.data;
      })
      .addCase(fetchlatter_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addlatter_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addlatter_type.fulfilled, (state, action) => {
        state.loading = false;
        state.latter_type = {
          ...state.latter_type,
          data: [action.payload.data, ...state.latter_type.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addlatter_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatelatter_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatelatter_type.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.latter_type?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.latter_type.data[index] = action.payload.data;
        } else {
          state.latter_type = {
            ...state.latter_type,
            data: [...state.latter_type, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatelatter_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletelatter_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletelatter_type.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.latter_type.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.latter_type = { ...state.latter_type, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletelatter_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = latter_typeSlice.actions;
export default latter_typeSlice.reducer;
