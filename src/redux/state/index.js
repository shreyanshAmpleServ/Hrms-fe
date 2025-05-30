import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";
export const fetchStates = createAsyncThunk(
  "states/fetchStates",
  async (data, thunkAPI) => {
    try {
      let params = {};
      if (data?.country_id) params.country_id = data?.country_id;
      if (data?.search) params.search = data?.search;
      if (data?.page) params.page = data?.page;
      if (data?.size) params.size = data?.size;
      const response = await apiClient.get("/v1/states", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch states"
      );
    }
  }
);

export const addState = createAsyncThunk(
  "states/addState",
  async (stateData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/states", stateData),
        {
          loading: "Adding state...",
          success: (res) => res.data.message || "State added successfully!",
          error: "Failed to add state",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add state"
      );
    }
  }
);

export const updateState = createAsyncThunk(
  "states/updateState",
  async ({ id, stateData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/states/${id}`, stateData),
        {
          loading: "Updating state...",
          success: (res) => res.data.message || "State updated successfully!",
          error: "Failed to update state",
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
        error.response?.data || "Failed to update state"
      );
    }
  }
);

export const deleteState = createAsyncThunk(
  "states/deleteState",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/states/${id}`),
        {
          loading: "Deleting state...",
          success: (res) => res.data.message || "State deleted successfully!",
          error: "Failed to delete state",
        }
      );
      return {
        data: { id },
        message: response.data.message || "State deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete state"
      );
    }
  }
);

// Fetch a Single State by ID
export const fetchStateById = createAsyncThunk(
  "states/fetchStateById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/states/${id}`);
      return response.data; // Returns the state details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch state"
      );
    }
  }
);

const statesSlice = createSlice({
  name: "states",
  initialState: {
    states: [],
    stateDetail: null,
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
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload.data;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addState.fulfilled, (state, action) => {
        state.loading = false;
        state.states = {
          ...state.states,
          data: [action.payload.data, ...state.states.data],
        };

        state.success = action.payload.message;
      })
      .addCase(addState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateState.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.states.data?.findIndex(
          (user) => user.id === action.payload.data.id
        );
        if (index !== -1) {
          state.states.data[index] = action.payload.data;
        } else {
          state.states = {
            ...state.states,
            data: [action.payload.data, ...state.states.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteState.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.states.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.states = { ...state.states, data: filteredData };
        state.success = action.payload.message;
      })
      .addCase(deleteState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchStateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateById.fulfilled, (state, action) => {
        state.loading = false;
        state.stateDetail = action.payload.data;
      })
      .addCase(fetchStateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = statesSlice.actions;
export default statesSlice.reducer;
