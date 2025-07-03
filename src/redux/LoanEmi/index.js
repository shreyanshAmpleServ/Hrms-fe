import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import { toast } from "react-hot-toast";

// Fetch all loan_Emi
export const fetchloan_Emi = createAsyncThunk(
  "loan_Emi/fetchloan_Emi",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas.search;
      if (datas?.page) params.page = datas.page;
      if (datas?.size) params.size = datas.size;

      const response = await apiClient.get("/v1/loan-Emi", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch loan Emi"
      );
    }
  }
);

// Add a loan_request
export const addloan_Emi = createAsyncThunk(
  "loan_Emi/addloan_Emi",
  async (loan_EmiData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/loan-Emi", loan_EmiData),
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
export const updateloan_Emi = createAsyncThunk(
  "loan_Emi/updateloan_Emi",
  async ({ id, loan_EmiData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/loan-Emi/${id}`, loan_EmiData),
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
export const deleteloan_Emi = createAsyncThunk(
  "loan_Emi/deleteloan_Emi",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/loan-Emi/${id}`),
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
const loan_EmiSlice = createSlice({
  name: "loan_Emi",
  initialState: {
    loan_Emi: [],
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
      .addCase(fetchloan_Emi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchloan_Emi.fulfilled, (state, action) => {
        state.loading = false;
        state.loan_Emi = action.payload.data;
      })
      .addCase(fetchloan_Emi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      // Add
      .addCase(addloan_Emi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addloan_Emi.fulfilled, (state, action) => {
        state.loading = false;
        state.loan_Emi = {
          ...state.loan_Emi,
          data: [action.payload.data, ...(state.loan_Emi?.data || [])],
        };
        state.success = action.payload.message;
      })
      .addCase(addloan_Emi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      // Update
      .addCase(updateloan_Emi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateloan_Emi.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loan_Emi?.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.loan_Emi.data[index] = action.payload.data;
        }
        state.success = action.payload.message;
      })
      .addCase(updateloan_Emi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      // Delete
      .addCase(deleteloan_Emi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteloan_Emi.fulfilled, (state, action) => {
        state.loading = false;
        state.loan_Emi = {
          ...state.loan_Emi,
          data: state.loan_Emi.data.filter(
            (item) => item.id !== action.payload.data.id
          ),
        };
        state.success = action.payload.message;
      })
      .addCase(deleteloan_Emi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });
  },
});

export const { clearMessages } = loan_EmiSlice.actions;
export default loan_EmiSlice.reducer;
