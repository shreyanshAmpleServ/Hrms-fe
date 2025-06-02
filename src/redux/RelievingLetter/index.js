import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all relieving letter with optional filters (search, date range, pagination).
 */
export const fetchRelievingLetter = createAsyncThunk(
  "relievingLetter/fetchRelievingLetter",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/relieving-letter", {
        params,
      });
      return response.data; // Returns list of relieving letter
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch relieving letter"
      );
    }
  }
);

/**
 * Create a new relieving letter.
 */
export const createRelievingLetter = createAsyncThunk(
  "relievingLetter/createRelievingLetter",
  async (relievingLetterData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/relieving-letter", relievingLetterData),
        {
          loading: "Creating relieving letter...",
          success: (res) =>
            res.data.message || "Exit interview created successfully!",
          error: "Failed to create relieving letter",
        }
      );
      return response.data; // Returns the newly created relieving letter
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create relieving letter"
      );
    }
  }
);

/**
 * Update an existing relieving letter by ID.
 */
export const updateRelievingLetter = createAsyncThunk(
  "relievingLetter/updateRelievingLetter",
  async ({ id, relievingLetterData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/relieving-letter/${id}`, relievingLetterData),
        {
          loading: "Updating relieving letter...",
          success: (res) =>
            res.data.message || "Exit interview updated successfully!",
          error: "Failed to update relieving letter",
        }
      );
      return response.data; // Returns the updated relieving letter
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Exit interview not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update relieving letter"
      );
    }
  }
);

/**
 * Delete an relieving letter by ID.
 */
export const deleteRelievingLetter = createAsyncThunk(
  "relievingLetter/deleteRelievingLetter",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/relieving-letter/${id}`),
        {
          loading: "Deleting relieving letter...",
          success: (res) =>
            res.data.message || "Exit interview deleted successfully!",
          error: "Failed to delete relieving letter",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Exit interview deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete relieving letter"
      );
    }
  }
);

/**
 * Fetch a single relieving letter by ID.
 */
export const fetchRelievingLetterById = createAsyncThunk(
  "relievingLetter/fetchRelievingLetterById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/relieving-letter/${id}`);
      return response.data; // Returns relieving letter details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch relieving letter"
      );
    }
  }
);

const relievingLetterSlice = createSlice({
  name: "relievingLetter",
  initialState: {
    relievingLetter: {},
    relievingLetterDetail: null,
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
      // Fetch all relieving letter
      .addCase(fetchRelievingLetter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelievingLetter.fulfilled, (state, action) => {
        state.loading = false;
        state.relievingLetter = action.payload.data;
      })
      .addCase(fetchRelievingLetter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create relieving letter
      .addCase(createRelievingLetter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRelievingLetter.fulfilled, (state, action) => {
        state.loading = false;
        state.relievingLetter = {
          ...state.relievingLetter,
          data: [...(state.relievingLetter.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createRelievingLetter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update relieving letter
      .addCase(updateRelievingLetter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRelievingLetter.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.relievingLetter.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.relievingLetter.data[index] = action.payload.data;
        } else {
          state.relievingLetter = {
            ...state.relievingLetter,
            data: [...(state.relievingLetter.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateRelievingLetter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete relieving letter
      .addCase(deleteRelievingLetter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRelievingLetter.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.relievingLetter.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.relievingLetter = {
          ...state.relievingLetter,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteRelievingLetter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch relieving letter by ID
      .addCase(fetchRelievingLetterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelievingLetterById.fulfilled, (state, action) => {
        state.loading = false;
        state.relievingLetterDetail = action.payload.data;
      })
      .addCase(fetchRelievingLetterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = relievingLetterSlice.actions;
export default relievingLetterSlice.reducer;
