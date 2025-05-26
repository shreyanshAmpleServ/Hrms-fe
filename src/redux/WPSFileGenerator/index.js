import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all wps files with optional filters (search, date range, pagination).
 */
export const fetchWPSFiles = createAsyncThunk(
  "wpsFiles/fetchWPSFiles",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/wps-file", {
        params,
      });
      return response.data; // Returns list of wps files
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch wps files"
      );
    }
  }
);

/**
 * Create a new wps file.
 */
export const createWPSFile = createAsyncThunk(
  "wpsFiles/createWPSFile",
  async (wpsFileData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/wps-file", wpsFileData),
        {
          loading: "Creating wps file...",
          success: (res) =>
            res.data.message || "WPS file created successfully!",
          error: "Failed to create wps file",
        }
      );
      return response.data; // Returns the newly created wps file
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create wps file"
      );
    }
  }
);

/**
 * Update an existing wps file by ID.
 */
export const updateWPSFile = createAsyncThunk(
  "wpsFiles/updateWPSFile",
  async ({ id, wpsFileData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/wps-file/${id}`, wpsFileData),
        {
          loading: "Updating wps file...",
          success: (res) =>
            res.data.message || "WPS file updated successfully!",
          error: "Failed to update wps file",
        }
      );
      return response.data; // Returns the updated wps file
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "WPS file not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update wps file"
      );
    }
  }
);

/**
 * Delete an wps file by ID.
 */
export const deleteWPSFile = createAsyncThunk(
  "wpsFiles/deleteWPSFile",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/wps-file/${id}`),
        {
          loading: "Deleting wps file...",
          success: (res) =>
            res.data.message || "WPS file deleted  successfully!",
          error: "Failed to delete wps file",
        }
      );
      return {
        data: { id },
        message: response.data.message || "WPS file deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete wps file"
      );
    }
  }
);

/**
 * Fetch a single wps file by ID.
 */
export const wpsFilesById = createAsyncThunk(
  "wpsFiles/wpsFilesById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/wps-file/${id}`);
      return response.data; // Returns wps file details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch wps file"
      );
    }
  }
);

const wpsFilesSlice = createSlice({
  name: "wpsFiles",
  initialState: {
    wpsFiles: {},
    wpsFilesDetail: null,
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
      // Fetch all wps files
      .addCase(fetchWPSFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWPSFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.wpsFiles = action.payload.data;
      })
      .addCase(fetchWPSFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create wps files
      .addCase(createWPSFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWPSFile.fulfilled, (state, action) => {
        state.loading = false;
        state.wpsFiles = {
          ...state.wpsFiles,
          data: [...(state.wpsFiles.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createWPSFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update wps files
      .addCase(updateWPSFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWPSFile.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.wpsFiles.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.wpsFiles.data[index] = action.payload.data;
        } else {
          state.wpsFiles = {
            ...state.wpsFiles,
            data: [...(state.wpsFiles.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateWPSFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete wps files
      .addCase(deleteWPSFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWPSFile.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.wpsFiles.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.wpsFiles = {
          ...state.wpsFiles,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteWPSFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch wps files by ID
      .addCase(wpsFilesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(wpsFilesById.fulfilled, (state, action) => {
        state.loading = false;
        state.wpsFilesDetail = action.payload.data; // Consider renaming to wpsFilesDetail
      })
      .addCase(wpsFilesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = wpsFilesSlice.actions;
export default wpsFilesSlice.reducer;
