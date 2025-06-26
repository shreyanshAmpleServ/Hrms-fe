import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all hr letter with optional filters (search, date range, pagination).
 */
export const fetchHRLetters = createAsyncThunk(
  "hrLetters/fetchHRLetters",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/hr-letter", {
        params,
      });
      return response.data; // Returns list of hr letter
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch hr letter"
      );
    }
  }
);

/**
 * Create a new hr letter.
 */
export const createHRLetter = createAsyncThunk(
  "hrLetters/createHRLetter",
  async (hrLetterData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/hr-letter", hrLetterData),
        {
          loading: "Creating hr letter...",
          success: (res) =>
            res.data.message || "hr letter created successfully!",
          error: "Failed to create hr letter",
        }
      );
      return response.data; // Returns the newly created hr letter
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create hr letter"
      );
    }
  }
);

/**
 * Update an existing hr letter by ID.
 */
export const updateHRLetter = createAsyncThunk(
  "hrLetters/updateHRLetter",
  async ({ id, hrLetterData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/hr-letter/${id}`, hrLetterData),
        {
          loading: "Updating hr letter...",
          success: (res) =>
            res.data.message || "hr letter updated successfully!",
          error: "Failed to update hr letter",
        }
      );
      return response.data; // Returns the updated hr letter
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "hr letter not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update hr letter"
      );
    }
  }
);

/**
 * Delete an hr letter by ID.
 */
export const deleteHRLetter = createAsyncThunk(
  "hrLetters/deleteHRLetter",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/hr-letter/${id}`),
        {
          loading: "Deleting hr letter...",
          success: (res) =>
            res.data.message || "hr letter deleted successfully!",
          error: "Failed to delete hr letter",
        }
      );
      return {
        data: { id },
        message: response.data.message || "hr letter deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete hr letter"
      );
    }
  }
);

/**
 * Fetch a single hr letter by ID.
 */
export const fetchHRLetterById = createAsyncThunk(
  "hrLetters/fetchHRLetterById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/hr-letter/${id}`);
      return response.data; // Returns hr letter details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch hr letter"
      );
    }
  }
);

const hrLettersSlice = createSlice({
  name: "hrLetters",
  initialState: {
    hrLetters: {},
    hrLetterDetail: null,
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
      // Fetch all hr letter
      .addCase(fetchHRLetters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHRLetters.fulfilled, (state, action) => {
        state.loading = false;
        state.hrLetters = action.payload.data;
      })
      .addCase(fetchHRLetters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create hr letter
      .addCase(createHRLetter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHRLetter.fulfilled, (state, action) => {
        state.loading = false;
        state.hrLetters = {
          ...state.hrLetters,
          data: [...(state.hrLetters.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createHRLetter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update hr letter
      .addCase(updateHRLetter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHRLetter.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.hrLetters.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.hrLetters.data[index] = action.payload.data;
        } else {
          state.hrLetters = {
            ...state.hrLetters,
            data: [...(state.hrLetters.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateHRLetter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete hr letter
      .addCase(deleteHRLetter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHRLetter.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.hrLetters.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.hrLetters = {
          ...state.hrLetters,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteHRLetter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch hr letter by ID
      .addCase(fetchHRLetterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHRLetterById.fulfilled, (state, action) => {
        state.loading = false;
        state.hrLetterDetail = action.payload.data;
      })
      .addCase(fetchHRLetterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = hrLettersSlice.actions;
export default hrLettersSlice.reducer;
