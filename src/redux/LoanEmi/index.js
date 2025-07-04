import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import { toast } from "react-hot-toast";

// Fetch all loanEmi
export const fetchloanEmi = createAsyncThunk(
  "loanEmi/fetchloanEmi",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas.search;
      if (datas?.page) params.page = datas.page;
      if (datas?.size) params.size = datas.size;

      const response = await apiClient.get("/v1/loan-emi-schedule", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch loan Emi"
      );
    }
  }
);

// Add a loan_request
export const addloanEmi = createAsyncThunk(
  "loanEmi/addloanEmi",
  async (loanEmiData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/loan-emi-schedule", loanEmiData),
        {
          loading: "Adding loan request...",
          success: "Loan request added successfully",
          error: "Failed to add loan request",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add loan request"
      );
    }
  }
);

// Update a loan_request
export const updateloanEmi = createAsyncThunk(
  "loanEmi/updateloanEmi",
  async ({ id, loanEmiData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/loan-emi-schedule/${id}`, loanEmiData),
        {
          loading: "Updating loan request...",
          success: "Loan request updated successfully",
          error: "Failed to update loan request",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({ status: 404, message: "Not found" });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update loan request"
      );
    }
  }
);

// Delete a loan_request
export const deleteloanEmi = createAsyncThunk(
  "loanEmi/deleteloanEmi",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/loan-emi-schedule/${id}`),
        {
          loading: "Deleting loan request...",
          success: "Loan request deleted successfully",
          error: "Failed to delete loan request",
        }
      );

      return {
        data: { id },
        message: response.data.message || "Loan request deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete loan request"
      );
    }
  }
);

// Slice
const loanEmiSlice = createSlice({
  name: "loanEmi",
  initialState: {
    loanEmi: [],
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
      // Fetch
      .addCase(fetchloanEmi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchloanEmi.fulfilled, (state, action) => {
        state.loading = false;
        state.loanEmi = action.payload.data;
      })
      .addCase(fetchloanEmi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      // Add
      .addCase(addloanEmi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addloanEmi.fulfilled, (state, action) => {
        state.loading = false;
        state.loanEmi = {
          ...state.loanEmi,
          data: [action.payload.data, ...(state.loanEmi?.data || [])],
        };
        state.success = action.payload.message;
      })
      .addCase(addloanEmi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      // Update
      .addCase(updateloanEmi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateloanEmi.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loanEmi?.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.loanEmi.data[index] = action.payload.data;
        }
        state.success = action.payload.message;
      })
      .addCase(updateloanEmi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      // Delete
      .addCase(deleteloanEmi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteloanEmi.fulfilled, (state, action) => {
        state.loading = false;
        state.loanEmi = {
          ...state.loanEmi,
          data: state.loanEmi.data.filter(
            (item) => item.id !== action.payload.data.id
          ),
        };
        state.success = action.payload.message;
      })
      .addCase(deleteloanEmi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });
  },
});

export const { clearMessages } = loanEmiSlice.actions;
export default loanEmiSlice.reducer;
