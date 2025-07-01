import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";

// Fetch All disciplinary_penalty
export const fetchdisciplinary_penalty = createAsyncThunk(
  "disciplinary_penalty/fetchdisciplinary_penalty",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.is_active) params.is_active = datas?.is_active;
      const response = await apiClient.get("/v1/disciplinary-penalty", {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch review-template"
      );
    }
  }
);

// Add an disciplinary_penalty
export const adddisciplinary_penalty = createAsyncThunk(
  "disciplinary_penalty/adddisciplinary_penalty",
  async (disciplinary_penaltyData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/disciplinary-penalty", disciplinary_penaltyData),
        {
          loading: "Adding disciplinary penalty...",
          success: "Disciplinary penalty added successfully",
          error: "Failed to add disciplinary penalty",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add disciplinary_penalty"
      );
    }
  }
);

// Update an disciplinary_penalty
export const updatedisciplinary_penalty = createAsyncThunk(
  "disciplinary_penalty/updatedisciplinary_penalty",
  async ({ id, disciplinary_penaltyData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(
          `/v1/disciplinary-penalty/${id}`,
          disciplinary_penaltyData
        ),
        {
          loading: "Updating disciplinary penalty...",
          success: "Disciplinary penalty updated successfully",
          error: "Failed to update disciplinary penalty",
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
        error.response?.data || "Failed to update disciplinary_penalty"
      );
    }
  }
);

// Delete an disciplinary_penalty
export const deletedisciplinary_penalty = createAsyncThunk(
  "disciplinary_penalty/deletedisciplinary_penalty",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/disciplinary-penalty/${id}`),
        {
          loading: "Deleting disciplinary penalty...",
          success: "Disciplinary penalty deleted successfully",
          error: "Failed to delete disciplinary penalty",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "disciplinary_penalty deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete disciplinary_penalty"
      );
    }
  }
);

const disciplinary_penaltySlice = createSlice({
  name: "disciplinary_penalty",
  initialState: {
    disciplinary_penalty: {},
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
      .addCase(fetchdisciplinary_penalty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchdisciplinary_penalty.fulfilled, (state, action) => {
        state.loading = false;
        state.disciplinary_penalty = action.payload.data;
      })
      .addCase(fetchdisciplinary_penalty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(adddisciplinary_penalty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adddisciplinary_penalty.fulfilled, (state, action) => {
        state.loading = false;
        state.disciplinary_penalty = {
          ...state.disciplinary_penalty,
          data: [action.payload.data, ...state.disciplinary_penalty.data],
        };
        state.success = action.payload.message;
      })
      .addCase(adddisciplinary_penalty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatedisciplinary_penalty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatedisciplinary_penalty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.disciplinary_penalty?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.disciplinary_penalty.data[index] = action.payload.data;
        } else {
          state.disciplinary_penalty = {
            ...state.disciplinary_penalty,
            data: [...state.disciplinary_penalty, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatedisciplinary_penalty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletedisciplinary_penalty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletedisciplinary_penalty.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.disciplinary_penalty.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.disciplinary_penalty = {
          ...state.disciplinary_penalty,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deletedisciplinary_penalty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = disciplinary_penaltySlice.actions;
export default disciplinary_penaltySlice.reducer;
