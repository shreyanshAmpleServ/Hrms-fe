import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/axiosConfig";

/**
 * Fetch upcoming anniversaries from dashboard endpoint
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
 * }>} The API response containing upcoming anniversaries data
 */
export const fetchUpcomingAnniversaries = createAsyncThunk(
  "dashboard/upcomingAnniversaries",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/dashboard/work-anniversary", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch upcoming anniversaries"
      );
    }
  }
);

const upcomingAnniversariesSlice = createSlice({
  name: "upcomingAnniversaries",
  /**
   * Initial state for upcoming anniversaries
   * @typedef {Object} InitialState
   * @property {Object|null} upcomingAnniversaries - The upcoming anniversaries data
   * @property {boolean} loading - Whether the data is being fetched
   * @property {string|null} error - The error message if the data fetching fails
   */
  initialState: {
    upcomingAnniversaries: null,
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
      .addCase(fetchUpcomingAnniversaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingAnniversaries.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingAnniversaries = action.payload.data;
      })
      .addCase(fetchUpcomingAnniversaries.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearMessages } = upcomingAnniversariesSlice.actions;
export default upcomingAnniversariesSlice.reducer;
