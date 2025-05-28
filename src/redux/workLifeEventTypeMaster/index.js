import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All work_life
export const fetchwork_life = createAsyncThunk(
  "work_life/fetchwork_life",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/work-life-event-type", {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch work_life"
      );
    }
  }
);

// Add an work_life
export const addwork_life = createAsyncThunk(
  "work_life/addwork_life",
  async (work_lifeData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/work-life-event-type", work_lifeData),
        {
          loading: "Adding Work Life Event Type...",
          success: "Work Life Event Type added successfully",
          error: "Failed to add Work Life Event Type",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add work_life"
      );
    }
  }
);

// Update an work_life
export const updatework_life = createAsyncThunk(
  "work_life/updatework_life",
  async ({ id, work_lifeData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/work-life-event-type/${id}`, work_lifeData),
        {
          loading: "Updating Work Life Event Type...",
          success: "Work Life Event Type updated successfully",
          error: "Failed to update Work Life Event Type",
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
        error.response?.data || "Failed to update work_life"
      );
    }
  }
);

// Delete an work_life
export const deletework_life = createAsyncThunk(
  "work_life/deletework_life",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/work-life-event-type/${id}`),
        {
          loading: "Deleting Work Life Event Type...",
          success: "Work Life Event Type deleted successfully",
          error: "Failed to delete Work Life Event Type",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Work Life Event Type deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete work_life"
      );
    }
  }
);

const work_lifeSlice = createSlice({
  name: "work_life",
  initialState: {
    work_life: [],
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
      .addCase(fetchwork_life.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchwork_life.fulfilled, (state, action) => {
        state.loading = false;
        state.work_life = action.payload.data;
      })
      .addCase(fetchwork_life.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addwork_life.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addwork_life.fulfilled, (state, action) => {
        state.loading = false;
        state.work_life = {
          ...state.work_life,
          data: [action.payload.data, ...state.work_life.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addwork_life.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatework_life.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatework_life.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.work_life?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.work_life.data[index] = action.payload.data;
        } else {
          state.work_life = {
            ...state.work_life,
            data: [...state.work_life, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatework_life.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletework_life.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletework_life.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.work_life.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.work_life = { ...state.work_life, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletework_life.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = work_lifeSlice.actions;
export default work_lifeSlice.reducer;
