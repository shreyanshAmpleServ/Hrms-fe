import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all appraisal entries with optional filters (search, date range, pagination).
 */
export const fetchAppraisalEntries = createAsyncThunk(
  "appraisalsEntries/fetchAppraisalEntries",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.startDate) params.startDate = datas?.startDate?.toISOString();
      if (datas?.endDate) params.endDate = datas?.endDate?.toISOString();
      if (datas?.is_active) params.is_active = datas?.is_active;

      const response = await apiClient.get("/v1/appraisal-entry", {
        params,
      });
      return response.data; // Returns list of appraisal entries
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch appraisal entries"
      );
    }
  }
);

/**
 * Create a new appraisal entries.
 */
export const createAppraisalEntries = createAsyncThunk(
  "appraisalEntries/createAppraisalEntries",
  async (appraisalEntriesData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/appraisal-entry", appraisalEntriesData),
        {
          loading: "Creating appraisal entry...",
          success: (res) =>
            res.data.message || "Appraisal entry created successfully!",
          error: "Failed to create appraisal entry",
        }
      );
      return response.data; // Returns the newly created appraisal entry
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create appraisal entry"
      );
    }
  }
);

/**
 * Update an existing appraisal enteries by ID.
 */
export const updateAppraisalEntries = createAsyncThunk(
  "appraisalEntries/updateAppraisalEntries",
  async ({ id, appraisalEntriesData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/appraisal-entry/${id}`, appraisalEntriesData),
        {
          loading: "Updating appraisal entry...",
          success: (res) =>
            res.data.message || "Appraisal entry updated successfully!",
          error: "Failed to update appraisal entry",
        }
      );
      return response.data; // Returns the updated appraisal entry
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Appraisal entry not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update appraisal entry"
      );
    }
  }
);

/**
 * Delete an appraisal entry by ID.
 */
export const deleteAppraisalEntries = createAsyncThunk(
  "appraisalEntries/deleteAppraisalEntries",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/appraisal-entry/${id}`),
        {
          loading: "Deleting appraisal entry...",
          success: (res) =>
            res.data.message || "Appraisal entry deleted  successfully!",
          error: "Failed to delete appraisal entry",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Appraisal entry deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete appraisal entry"
      );
    }
  }
);

/**
 * Fetch a single appraisal entry by ID.
 */
export const appraisalEntriesById = createAsyncThunk(
  "appraisalEntries/appraisalEntriesById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/appraisal-entry/${id}`);
      return response.data; // Returns appraisal entry details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch appraisal entry"
      );
    }
  }
);

const appraisalEntriesSlice = createSlice({
  name: "appraisalEntries",
  initialState: {
    appraisalEntries: {},
    appraisalEntriesDetail: null,
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
      // Fetch all appraisal enteries
      .addCase(fetchAppraisalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppraisalEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.appraisalEntries = action.payload.data;
      })
      .addCase(fetchAppraisalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create appraisal enteries
      .addCase(createAppraisalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppraisalEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.appraisalEntries = {
          ...state.appraisalEntries,
          data: [...(state.appraisalEntries.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createAppraisalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update appraisal enteries
      .addCase(updateAppraisalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppraisalEntries.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appraisalEntries.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.appraisalEntries.data[index] = action.payload.data;
        } else {
          state.appraisalEntries = {
            ...state.appraisalEntries,
            data: [...(state.appraisalEntries.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateAppraisalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete appraisal enteries
      .addCase(deleteAppraisalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppraisalEntries.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.appraisalEntries.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.appraisalEntries = {
          ...state.appraisalEntries,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteAppraisalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch appraisal enteries by ID
      .addCase(appraisalEntriesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(appraisalEntriesById.fulfilled, (state, action) => {
        state.loading = false;
        state.appraisalEntriesDetail = action.payload.data; // Consider renaming to appraisalEntriesDetail
      })
      .addCase(appraisalEntriesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = appraisalEntriesSlice.actions;
export default appraisalEntriesSlice.reducer;
