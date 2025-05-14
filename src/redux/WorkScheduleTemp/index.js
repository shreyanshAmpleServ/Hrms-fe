import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All work schedule templates
export const fetchWorkScheduleTemp = createAsyncThunk(
  "WorkScheduleTemp/fetchWorkScheduleTemp",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/work-schedule-template?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}`);
      return response.data; // Returns a list of work schedule template
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch work schedule template",
      );
    }
  },
);

// Add a work schedule template
export const addWorkScheduleTemp = createAsyncThunk(
  "WorkScheduleTemp/addWorkScheduleTemp",
  async (reqData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/work-schedule-template", reqData),
        {
          loading: "Work schedule template adding...",
          success: (res) => res.data.message || "Work schedule template added successfully!",
          error: "Failed to add work schedule template",
        }
      );
      // const response = await apiClient.post("/v1/work-schedule-template", reqData);
      // toast.success(response.data.message || "Work schedule template created successfully");
      return response.data; // Returns the newly added work schedule template
    } catch (error) {
      toast.error(error.response?.data || "Failed to add work schedule template");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add work schedule template",
      );
    }
  },
);

// Update a work schedule template
export const updateWorkScheduleTemp = createAsyncThunk(
  "WorkScheduleTemp/updateWorkScheduleTemp",
  async ({ id, reqData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/work-schedule-template/${id}`, reqData),
        {
          loading: "Work schedule template updating...",
          success: (res) => res.data.message || "Work schedule template updated successfully!",
          error: "Failed to update work schedule template",
        }
      );
      // const response = await apiClient.put(`/v1/WorkScheduleTemp/${id}`, reqData);
      // toast.success(response.data.message || "Work schedule template updated successfully");
      return response.data; // Returns the updated work schedule template
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Work schedule template not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Work schedule template not found",
        });
      }
      toast.error(error.response?.data || "Failed to update work schedule template");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update work schedule template",
      );
    }
  },
);

// Delete a work schedule template
export const deleteWorkScheduleTemp = createAsyncThunk(
  "WorkScheduleTemp/deleteWorkScheduleTemp",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/work-schedule-template/${id}`);
      toast.success(response.data.message || "Work schedule template deleted successfully");
      return {
        data: { id },
        message: response.data.message || "Work schedule template deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete work schedule template");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete work schedule template",
      );
    }
  },
);

// Fetch a Single work schedule template by ID
export const fetchWorkScheduleTempById = createAsyncThunk(
  "WorkScheduleTemp/fetchWorkScheduleTempById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/work-schedule-template/${id}`);
      return response.data; // Returns the work schedule template details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch work schedule template",
      );
    }
  },
);

const WorkScheduleTempSlice = createSlice({
  name: "WorkScheduleTemp",
  initialState: {
    WorkScheduleTemp: {},
    WorkScheduleTempDetail: null,
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkScheduleTemp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkScheduleTemp.fulfilled, (state, action) => {
        state.loading = false;
        state.WorkScheduleTemp = action.payload.data;
      })
      .addCase(fetchWorkScheduleTemp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addWorkScheduleTemp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWorkScheduleTemp.fulfilled, (state, action) => {
        state.loading = false;
        state.WorkScheduleTemp ={...state.WorkScheduleTemp,data: [action.payload.data, ...state.WorkScheduleTemp.data]};
        state.success = action.payload.message;
      })
      .addCase(addWorkScheduleTemp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateWorkScheduleTemp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkScheduleTemp.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.WorkScheduleTemp?.data?.findIndex(
          (user) => user.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.WorkScheduleTemp.data[index] = action.payload.data;
        } else {
          state.WorkScheduleTemp ={...state.WorkScheduleTemp , data: [action.payload.data, ...state.WorkScheduleTemp.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateWorkScheduleTemp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteWorkScheduleTemp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkScheduleTemp.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.WorkScheduleTemp.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.WorkScheduleTemp = {...state.WorkScheduleTemp,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deleteWorkScheduleTemp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchWorkScheduleTempById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkScheduleTempById.fulfilled, (state, action) => {
        state.loading = false;
        state.WorkScheduleTempDetail = action.payload.data;
      })
      .addCase(fetchWorkScheduleTempById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = WorkScheduleTempSlice.actions;
export default WorkScheduleTempSlice.reducer;
