import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/** disciplinryAction
 * Fetch all disciplinryAction with optional filters (search, date range, pagination).
 */
export const fetchdisciplinryAction = createAsyncThunk(
  "disciplinryAction/fetchdisciplinryAction",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/disciplinary-action", {
        params,
      });
      return response.data; // Returns list of disciplinryAction
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch disciplinryAction"
      );
    }
  }
);

/**
 * Create a new disciplinryAction.
 */
export const createdisciplinryAction = createAsyncThunk(
  "disciplinryAction/createdisciplinryAction",
  async (disciplinryActionData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/disciplinary-action", disciplinryActionData),
        {
          loading: "Creating disciplinryAction...",
          success: (res) =>
            res.data.message || "disciplinryAction created successfully!",
          error: "Failed to create disciplinryAction",
        }
      );
      return response.data; // Returns the newly created disciplinryAction
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create disciplinryAction"
      );
    }
  }
);

/**
 * Update an existing disciplinryAction by ID.
 */
export const updatedisciplinryAction = createAsyncThunk(
  "disciplinryAction/updatedisciplinryAction",
  async ({ id, disciplinryActionData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/disciplinary-action/${id}`, disciplinryActionData),
        {
          loading: "Updating disciplinryAction...",
          success: (res) =>
            res.data.message || "disciplinryAction updated successfully!",
          error: "Failed to update disciplinryAction",
        }
      );
      return response.data; // Returns the updated disciplinryAction
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "disciplinryAction not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update disciplinryAction"
      );
    }
  }
);

/**
 * Delete an disciplinryAction by ID.
 */
export const deletedisciplinryAction = createAsyncThunk(
  "disciplinryAction/deletedisciplinryAction",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/disciplinary-action/${id}`),
        {
          loading: "Deleting disciplinryAction...",
          success: (res) =>
            res.data.message || "disciplinryAction deleted successfully!",
          error: "Failed to delete disciplinryAction",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "disciplinryAction deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete disciplinryAction"
      );
    }
  }
);

/**
 * Fetch a single disciplinryAction by ID.
 */
export const fetchdisciplinryActionById = createAsyncThunk(
  "disciplinryAction/fetchdisciplinryActionById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/disciplinary-action/${id}`);
      return response.data; // Returns disciplinryAction details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch disciplinryAction"
      );
    }
  }
);

const disciplinryActionSlice = createSlice({
  name: "disciplinryAction",
  initialState: {
    disciplinryAction: {},
    disciplinryActionDetail: null,
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
      // Fetch all disciplinryAction
      .addCase(fetchdisciplinryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchdisciplinryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.disciplinryAction = action.payload.data;
      })
      .addCase(fetchdisciplinryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create disciplinryAction
      .addCase(createdisciplinryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createdisciplinryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.disciplinryAction = {
          ...state.disciplinryAction,
          data: [...(state.disciplinryAction.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createdisciplinryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update disciplinryAction
      .addCase(updatedisciplinryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatedisciplinryAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.disciplinryAction.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.disciplinryAction.data[index] = action.payload.data;
        } else {
          state.disciplinryAction = {
            ...state.disciplinryAction,
            data: [
              ...(state.disciplinryAction.data || []),
              action.payload.data,
            ],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatedisciplinryAction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Something went wrong";
      })

      // Delete disciplinryAction
      .addCase(deletedisciplinryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletedisciplinryAction.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.disciplinryAction.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.disciplinryAction = {
          ...state.disciplinryAction,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deletedisciplinryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch disciplinryAction by ID
      .addCase(fetchdisciplinryActionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchdisciplinryActionById.fulfilled, (state, action) => {
        state.loading = false;
        state.disciplinryActionDetail = action.payload.data;
      })
      .addCase(fetchdisciplinryActionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = disciplinryActionSlice.actions;
export default disciplinryActionSlice.reducer;
