import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/axiosConfig";

/**
 * Fetch upcoming birthdays from dashboard endpoint
 * @returns {Promise<{
 *   success: boolean,
 *   data: {
 *     [date: string]: Array<{
 *       name: string,
 *       designation: string,
 *       profile_pic: string
 *     }>
 *   },
 *   message: string,
 *   status: number
 * }>} The API response containing upcoming birthdays data
 */
export const fetchUpcomingBirthdays = createAsyncThunk(
  "dashboard/upcomingBirthdays",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(
        "/v1/dashboard/get-upcoming-birthdays",
        { params: { page: 1, limit: 10 } }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch upcoming birthdays"
      );
    }
  }
);

const upcomingBirthdaysSlice = createSlice({
  name: "upcomingBirthdays",
  initialState: {
    upcomingBirthdays: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingBirthdays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingBirthdays.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingBirthdays = action.payload.data;
      })
      .addCase(fetchUpcomingBirthdays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = upcomingBirthdaysSlice.actions;
export default upcomingBirthdaysSlice.reducer;
