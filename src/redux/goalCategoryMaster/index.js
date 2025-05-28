import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All goal_category
export const fetchgoal_category = createAsyncThunk(
  "goal_category/fetchgoal_category",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/goal-category", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch goal category"
      );
    }
  }
);

// Add an goal_category
export const addgoal_category = createAsyncThunk(
  "goal_category/addgoal_category",
  async (goal_categoryData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/goal-category", goal_categoryData),
        {
          loading: "Adding goal category...",
          success: "Goal category added successfully",
          error: "Failed to add goal category",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add goal_category"
      );
    }
  }
);

// Update an goal_category
export const updategoal_category = createAsyncThunk(
  "goal_category/updategoal_category",
  async ({ id, goal_categoryData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/goal-category/${id}`, goal_categoryData),
        {
          loading: "Updating goal category...",
          success: "Goal category updated successfully",
          error: "Failed to update goal category",
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
        error.response?.data || "Failed to update goal_category"
      );
    }
  }
);

// Delete an goal_category
export const deletegoal_category = createAsyncThunk(
  "goal_category/deletegoal_category",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/goal-category/${id}`),
        {
          loading: "Deleting goal category...",
          success: "Goal category deleted successfully",
          error: "Failed to delete goal category",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Goal category deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete goal_category"
      );
    }
  }
);

const goal_categorySlice = createSlice({
  name: "goal_category",
  initialState: {
    goal_category: [],
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
      .addCase(fetchgoal_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchgoal_category.fulfilled, (state, action) => {
        state.loading = false;
        state.goal_category = action.payload.data;
      })
      .addCase(fetchgoal_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addgoal_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addgoal_category.fulfilled, (state, action) => {
        state.loading = false;
        state.goal_category = {
          ...state.goal_category,
          data: [action.payload.data, ...state.goal_category.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addgoal_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updategoal_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updategoal_category.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.goal_category?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.goal_category.data[index] = action.payload.data;
        } else {
          state.goal_category = {
            ...state.goal_category,
            data: [...state.goal_category, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updategoal_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletegoal_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletegoal_category.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.goal_category.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.goal_category = { ...state.goal_category, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletegoal_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = goal_categorySlice.actions;
export default goal_categorySlice.reducer;
