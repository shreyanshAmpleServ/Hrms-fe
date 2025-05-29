import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All holiday calenders
export const fetchHolidayCalender = createAsyncThunk(
  "holidayCalender/fetchHolidayCalender",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(
        `/v1/holiday-calender?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}`
      );
      return response.data; // Returns a list of holiday calender
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch holiday calender"
      );
    }
  }
);

// Add a holiday calender
export const addHolidayCalender = createAsyncThunk(
  "holidayCalender/addHolidayCalender",
  async (reqData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/holiday-calender", reqData),
        {
          loading: "Holiday calender adding...",
          success: (res) =>
            res.data.message || "Holiday calender added successfully!",
          error: "Failed to add holiday calender",
        }
      );
      return response.data; // Returns the newly added holiday calender
    } catch (error) {
      toast.error(error.response?.data || "Failed to add holiday calender");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add holiday calender"
      );
    }
  }
);

// Update a holiday calender
export const updateHolidayCalender = createAsyncThunk(
  "holidayCalender/updateHolidayCalender",
  async ({ id, reqData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/holiday-calender/${id}`, reqData),
        {
          loading: "Holiday calender updating...",
          success: (res) =>
            res.data.message || "Holiday calender updated successfully!",
          error: "Failed to update holiday calender",
        }
      );

      return response.data; // Returns the updated holiday calender
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Holiday calender not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Holiday calender not found",
        });
      }
      toast.error(error.response?.data || "Failed to update holiday calender");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update holiday calender"
      );
    }
  }
);

export const deleteHolidayCalender = createAsyncThunk(
  "holidayCalender/deleteHolidayCalender",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/holiday-calender/${id}`),
        {
          loading: "Holiday calender deleting...",
          success: (res) =>
            res.data.message || "Holiday calender deleted successfully",
          error: "Failed to delete holiday calender",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Holiday calender deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete holiday calender"
      );
    }
  }
);

// Fetch a Single holiday calender by ID
export const fetchHolidayCalenderById = createAsyncThunk(
  "holidayCalender/fetchHolidayCalenderById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/holiday-calender/${id}`);
      return response.data; // Returns the holiday calender details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch holiday calender"
      );
    }
  }
);

const holidayCalenderSlice = createSlice({
  name: "holidayCalender",
  initialState: {
    holidayCalender: [],
    holidayCalenderDetail: null,
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
      .addCase(fetchHolidayCalender.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidayCalender.fulfilled, (state, action) => {
        state.loading = false;
        state.holidayCalender = action.payload.data;
      })
      .addCase(fetchHolidayCalender.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addHolidayCalender.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHolidayCalender.fulfilled, (state, action) => {
        state.loading = false;
        state.holidayCalender = {
          ...state.holidayCalender,
          data: [action.payload.data, ...state.holidayCalender.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addHolidayCalender.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateHolidayCalender.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHolidayCalender.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.holidayCalender.data?.findIndex(
          (user) => user.id === action.payload.data.id
        );
        if (index !== -1) {
          state.holidayCalender.data[index] = action.payload.data;
        } else {
          state.holidayCalender = {
            ...state.holidayCalender,
            data: [action.payload.data, ...state.holidayCalender.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateHolidayCalender.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteHolidayCalender.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHolidayCalender.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.holidayCalender.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.holidayCalender = {
          ...state.holidayCalender,
          data: filteredData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteHolidayCalender.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchHolidayCalenderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidayCalenderById.fulfilled, (state, action) => {
        state.loading = false;
        state.holidayCalenderDetail = action.payload.data;
      })
      .addCase(fetchHolidayCalenderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = holidayCalenderSlice.actions;
export default holidayCalenderSlice.reducer;
