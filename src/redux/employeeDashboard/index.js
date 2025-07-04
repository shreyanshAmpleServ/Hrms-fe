import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// 🎯 Async Thunks
export const fetchEmployeeDetails = createAsyncThunk(
  "employeeDashboard/fetchEmployeeDetails",
  async (_, thunkAPI) => {
    try {
      const res = await apiClient.get("/v1/employeeDashboard/employee-details");
      return res.data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch employee details"
      );
    }
  }
);

export const fetchUpcomingBirthdays = createAsyncThunk(
  "employeeDashboard/fetchBirthdays",
  async (_, thunkAPI) => {
    try {
      const res = await apiClient.get(
        "/v1/employeeDashboard/get-all-upcoming-birthdays"
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load upcoming birthdays");
    }
  }
);

export const fetchEmployeeAttendance = createAsyncThunk(
  "employeeDashboard/fetchAttendance",
  async (_, thunkAPI) => {
    try {
      const res = await apiClient.get(
        "/v1/employeeDashboard/employee-attendance"
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load attendance data");
    }
  }
);

export const fetchEmployeeLeaves = createAsyncThunk(
  "employeeDashboard/fetchLeaves",
  async (_, thunkAPI) => {
    try {
      const res = await apiClient.get("/v1/employeeDashboard/employee-leaves");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load leaves");
    }
  }
);

const employeeDashboardSlice = createSlice({
  name: "employeeDashboard",
  initialState: {
    loading: false,
    error: null,
    profile: null,
    birthdays: [],
    attendance: {
      loading: false,
      error: null,
      data: null,
    },
    leaves: [],
  },
  extraReducers: (builder) => {
    builder

      // 🌟 employee details
      .addCase(fetchEmployeeDetails.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // 🌟 birthdays
      .addCase(fetchUpcomingBirthdays.fulfilled, (state, action) => {
        state.birthdays = action.payload;
      })

      // 🌟 attendance
      .addCase(fetchEmployeeAttendance.pending, (state) => {
        state.attendance.loading = true;
        state.attendance.error = null;
      })
      .addCase(fetchEmployeeAttendance.fulfilled, (state, action) => {
        state.attendance.loading = false;
        state.attendance.data = action.payload;
      })
      .addCase(fetchEmployeeAttendance.rejected, (state, action) => {
        state.attendance.loading = false;
        state.attendance.error = action.payload;
      })

      // 🌟 leaves
      .addCase(fetchEmployeeLeaves.fulfilled, (state, action) => {
        state.leaves = action.payload;
      })

      // 🌟 optional global matchers
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default employeeDashboardSlice.reducer;
