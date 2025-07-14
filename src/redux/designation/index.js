import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// designation Slice

// Fetch All designation
export const fetchdesignation = createAsyncThunk(
  "designation/fetchdesignation",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.is_active) params.is_active = datas?.is_active;

      const response = await apiClient.get("/v1/designation", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch designation"
      );
    }
  }
);

// Add an designation
export const adddesignation = createAsyncThunk(
  "designation/adddesignation",
  async (designationData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/designation", designationData),
        {
          loading: "Adding designation...",
          success: "Designation added successfully",
          error: "Failed to add designation",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add designation"
      );
    }
  }
);

// Update an designation
export const updatedesignation = createAsyncThunk(
  "designation/updatedesignation",
  async ({ id, designationData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/designation/${id}`, designationData),
        {
          loading: "Updating designation...",
          success: "Designation updated successfully",
          error: "Failed to update designation",
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
        error.response?.data || "Failed to update designation"
      );
    }
  }
);

// Delete an designation
export const deletedesignation = createAsyncThunk(
  "designation/deletedesignation",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/designation/${id}`),
        {
          loading: "Deleting designation...",
          success: "Designation deleted successfully",
          error: "Failed to delete designation",
        }
      );
      return {
        data: { id },
        message: response.data.message || "designation deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete designation"
      );
    }
  }
);

export const designationOptionsFn = createAsyncThunk(
  "designation/designationOptionsFn",
  async (thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/designation-options");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch designation options"
      );
    }
  }
);

const designationSlice = createSlice({
  name: "designation",
  initialState: {
    designation: [],
    loading: false,
    error: null,
    success: null,
    designationOptions: null,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchdesignation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchdesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.designation = action.payload.data;
      })
      .addCase(fetchdesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(adddesignation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adddesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.designation = {
          ...state.designation,
          data: [action.payload.data, ...state.designation.data],
        };
        state.success = action.payload.message;
      })
      .addCase(adddesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatedesignation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatedesignation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.designation?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.designation.data[index] = action.payload.data;
        } else {
          state.designation = {
            ...state.designation,
            data: [...state.designation, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatedesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletedesignation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletedesignation.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.designation.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.designation = { ...state.designation, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletedesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(designationOptionsFn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(designationOptionsFn.fulfilled, (state, action) => {
        state.loading = false;
        state.designationOptions = action.payload.data;
      })
      .addCase(designationOptionsFn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = designationSlice.actions;
export default designationSlice.reducer;
