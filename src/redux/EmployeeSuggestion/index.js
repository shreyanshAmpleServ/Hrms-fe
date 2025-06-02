import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all employee suggestion with optional filters (search, date range, pagination).
 */
export const fetchEmployeeSuggestion = createAsyncThunk(
  "employeeSuggestion/fetchEmployeeSuggestion",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/suggestion-box", {
        params,
      });
      return response.data; // Returns list of employee suggestion
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employee suggestion"
      );
    }
  }
);

/**
 * Create a new employee suggestion.
 */
export const createEmployeeSuggestion = createAsyncThunk(
  "employeeSuggestion/createEmployeeSuggestion",
  async (employeeSuggestionData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/suggestion-box", employeeSuggestionData),
        {
          loading: "Creating employee suggestion...",
          success: (res) =>
            res.data.message || "employee suggestion created successfully!",
          error: "Failed to create employee suggestion",
        }
      );
      return response.data; // Returns the newly created employee suggestion
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create employee suggestion"
      );
    }
  }
);

/**
 * Update an existing employee suggestion by ID.
 */
export const updateEmployeeSuggestion = createAsyncThunk(
  "employeeSuggestion/updateEmployeeSuggestion",
  async ({ id, employeeSuggestionData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/suggestion-box/${id}`, employeeSuggestionData),
        {
          loading: "Updating employee suggestion...",
          success: (res) =>
            res.data.message || "employee suggestion updated successfully!",
          error: "Failed to update employee suggestion",
        }
      );
      return response.data; // Returns the updated employee suggestion
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "employee suggestion not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update employee suggestion"
      );
    }
  }
);

/**
 * Delete an employee suggestion by ID.
 */
export const deleteEmployeeSuggestion = createAsyncThunk(
  "employeeSuggestion/deleteEmployeeSuggestion",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/suggestion-box/${id}`),
        {
          loading: "Deleting employee suggestion...",
          success: (res) =>
            res.data.message || "employee suggestion deleted successfully!",
          error: "Failed to delete employee suggestion",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "employee suggestion deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete employee suggestion"
      );
    }
  }
);

/**
 * Fetch a single employee suggestion by ID.
 */
export const fetchEmployeeSuggestionById = createAsyncThunk(
  "employeeSuggestion/fetchEmployeeSuggestionById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/suggestion-box/${id}`);
      return response.data; // Returns employee suggestion details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employee suggestion"
      );
    }
  }
);

const employeeSuggestionSlice = createSlice({
  name: "employeeSuggestion",
  initialState: {
    employeeSuggestion: {},
    employeeSuggestionDetail: null,
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
      // Fetch all employee suggestion
      .addCase(fetchEmployeeSuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeSuggestion.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeSuggestion = action.payload.data;
      })
      .addCase(fetchEmployeeSuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create employee suggestion
      .addCase(createEmployeeSuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeeSuggestion.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeSuggestion = {
          ...state.employeeSuggestion,
          data: [...(state.employeeSuggestion.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createEmployeeSuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update employee suggestion
      .addCase(updateEmployeeSuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeSuggestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employeeSuggestion.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.employeeSuggestion.data[index] = action.payload.data;
        } else {
          state.employeeSuggestion = {
            ...state.employeeSuggestion,
            data: [
              ...(state.employeeSuggestion.data || []),
              action.payload.data,
            ],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateEmployeeSuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete employee suggestion
      .addCase(deleteEmployeeSuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeSuggestion.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.employeeSuggestion.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.employeeSuggestion = {
          ...state.employeeSuggestion,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteEmployeeSuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch employee suggestion by ID
      .addCase(fetchEmployeeSuggestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeSuggestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeSuggestionDetail = action.payload.data;
      })
      .addCase(fetchEmployeeSuggestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = employeeSuggestionSlice.actions;
export default employeeSuggestionSlice.reducer;
