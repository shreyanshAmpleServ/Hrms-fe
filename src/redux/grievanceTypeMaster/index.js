import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// grievance_type Slice

// Fetch All grievance_type
export const fetchgrievance_type = createAsyncThunk(
  "grievance_type/fetchgrievance_type",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/grievance-type", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch review-template"
      );
    }
  }
);

// Add an grievance_type
export const addgrievance_type = createAsyncThunk(
  "grievance_type/addgrievance_type",
  async (grievance_typeData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/grievance-type", grievance_typeData),
        {
          loading: "Adding Grievance Type...",
          success: "Grievance Type added successfully",
          error: "Failed to add Grievance Type",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add Grievance Type"
      );
    }
  }
);

// Update an grievance_type
export const updategrievance_type = createAsyncThunk(
  "grievance_type/updategrievance_type",
  async ({ id, grievance_typeData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/grievance-type/${id}`, grievance_typeData),
        {
          loading: "Updating Grievance Type...",
          success: "Grievance Type updated successfully",
          error: "Failed to update Grievance Type",
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
        error.response?.data || "Failed to update grievance_type"
      );
    }
  }
);

// Delete an grievance_type
export const deletegrievance_type = createAsyncThunk(
  "grievance_type/deletegrievance_type",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/grievance-type/${id}`),
        {
          loading: "Deleting Grievance Type...",
          success: "Grievance Type deleted successfully",
          error: "Failed to delete Grievance Type",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Grievance Type deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete Grievance Type"
      );
    }
  }
);

const grievance_typeSlice = createSlice({
  name: "grievance_type",
  initialState: {
    grievance_type: [],
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
      .addCase(fetchgrievance_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchgrievance_type.fulfilled, (state, action) => {
        state.loading = false;
        state.grievance_type = action.payload.data;
      })
      .addCase(fetchgrievance_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addgrievance_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addgrievance_type.fulfilled, (state, action) => {
        state.loading = false;
        state.grievance_type = {
          ...state.grievance_type,
          data: [action.payload.data, ...state.grievance_type.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addgrievance_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updategrievance_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updategrievance_type.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.grievance_type?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.grievance_type.data[index] = action.payload.data;
        } else {
          state.grievance_type = {
            ...state.grievance_type,
            data: [...state.grievance_type, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updategrievance_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletegrievance_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletegrievance_type.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.grievance_type.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.grievance_type = { ...state.grievance_type, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletegrievance_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = grievance_typeSlice.actions;
export default grievance_typeSlice.reducer;
