import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all warning letters with optional filters (search, date range, pagination).
 */
export const fetchWarningLetters = createAsyncThunk(
  "warningLetters/fetchWarningLetters",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/warning-letter", {
        params,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch warning letters"
      );
    }
  }
);

/**
 * Create a new warning letters.
 */
export const createWarningLetters = createAsyncThunk(
  "warningLetters/createWarningLetters",
  async (warningLettersData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/warning-letter", warningLettersData),
        {
          loading: "Creating warning letters...",
          success: (res) =>
            res.data.message || "warning letters created successfully!",
          error: "Failed to create warning letters",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create warning letters"
      );
    }
  }
);

/**
 * Update an existing warning letters by ID.
 */
export const updateWarningLetters = createAsyncThunk(
  "warningLetters/updateWarningLetters",
  async ({ id, warningLettersData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/warning-letter/${id}`, warningLettersData),
        {
          loading: "Updating warning letters...",
          success: (res) =>
            res.data.message || "warning letters updated successfully!",
          error: "Failed to update warning letters",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "warning letters not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update warning letters"
      );
    }
  }
);

/**
 * Delete an warning letters by ID.
 */
export const deleteWarningLetters = createAsyncThunk(
  "warningLetters/deleteWarningLetters",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/warning-letter/${id}`),
        {
          loading: "Deleting warning letters...",
          success: (res) =>
            res.data.message || "warning letters deleted successfully!",
          error: "Failed to delete warning letters",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "warning letters deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete warning letters"
      );
    }
  }
);

/**
 * Fetch a single warning letters by ID.
 */
export const fetchWarningLettersById = createAsyncThunk(
  "warningLetters/fetchWarningLettersById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/warning-letter/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch warning letters"
      );
    }
  }
);

const warningLettersSlice = createSlice({
  name: "warningLetters",
  initialState: {
    warningLetters: {},
    warningLettersDetail: null,
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
      .addCase(fetchWarningLetters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarningLetters.fulfilled, (state, action) => {
        state.loading = false;
        state.warningLetters = action.payload.data;
      })
      .addCase(fetchWarningLetters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createWarningLetters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWarningLetters.fulfilled, (state, action) => {
        state.loading = false;
        state.warningLetters = {
          ...state.warningLetters,
          data: [...(state.warningLetters.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createWarningLetters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateWarningLetters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWarningLetters.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.warningLetters.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.warningLetters.data[index] = action.payload.data;
        } else {
          state.warningLetters = {
            ...state.warningLetters,
            data: [...(state.warningLetters.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateWarningLetters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteWarningLetters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWarningLetters.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.warningLetters.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.warningLetters = {
          ...state.warningLetters,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteWarningLetters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchWarningLettersById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarningLettersById.fulfilled, (state, action) => {
        state.loading = false;
        state.warningLettersDetail = action.payload.data;
      })
      .addCase(fetchWarningLettersById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = warningLettersSlice.actions;
export default warningLettersSlice.reducer;
