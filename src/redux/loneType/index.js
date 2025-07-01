import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All loan_type
export const fetchloan_type = createAsyncThunk(
  "loan_type/fetchloan_type",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;
      if (datas?.is_active) params.is_active = datas?.is_active;

      const response = await apiClient.get("/v1/loan-type", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch review-template"
      );
    }
  }
);

// Add an loan_type
export const addloan_type = createAsyncThunk(
  "loan_type/addloan_type",
  async (loan_typeData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/loan-type", loan_typeData),
        {
          loading: "Adding Loan Type...",
          success: "Loan Type added successfully",
          error: "Failed to add Loan Type",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add Loan Type"
      );
    }
  }
);

// Update an loan_type
export const updateloan_type = createAsyncThunk(
  "loan_type/updateloan_type",
  async ({ id, loan_typeData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/loan-type/${id}`, loan_typeData),
        {
          loading: "Updating Loan Type...",
          success: "Loan Type updated successfully",
          error: "Failed to update Loan Type",
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
        error.response?.data || "Failed to update loan_type"
      );
    }
  }
);

// Delete an loan_type
export const deleteloan_type = createAsyncThunk(
  "loan_type/deleteloan_type",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/loan-type/${id}`),
        {
          loading: "Deleting Loan Type...",
          success: "Loan Type deleted successfully",
          error: "Failed to delete Loan Type",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Loan Type deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete Loan Type"
      );
    }
  }
);

const loan_typeSlice = createSlice({
  name: "loan_type",
  initialState: {
    loan_type: [],
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
      .addCase(fetchloan_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchloan_type.fulfilled, (state, action) => {
        state.loading = false;
        state.loan_type = action.payload.data;
      })
      .addCase(fetchloan_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addloan_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addloan_type.fulfilled, (state, action) => {
        state.loading = false;
        state.loan_type = {
          ...state.loan_type,
          data: [action.payload.data, ...state.loan_type.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addloan_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateloan_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateloan_type.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loan_type?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.loan_type.data[index] = action.payload.data;
        } else {
          state.loan_type = {
            ...state.loan_type,
            data: [...state.loan_type, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateloan_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteloan_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteloan_type.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.loan_type.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.loan_type = { ...state.loan_type, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deleteloan_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = loan_typeSlice.actions;
export default loan_typeSlice.reducer;
