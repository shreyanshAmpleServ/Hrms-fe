import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/default-configuration");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch settings"
      );
    }
  }
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (datas, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post(`/v1/default-configuration-upsert`, datas.reqData),
        {
          loading: "Updating settings...",
          success: (res) =>
            res.data.message || "Settings updated successfully!",
          error: (error) => error.response?.data?.message,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update settings"
      );
    }
  }
);
const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    settings: {},
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
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.data;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.data;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});
export const { clearMessages } = settingsSlice.actions;
export default settingsSlice.reducer;
