import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";

export const fetchLoanMaster = createAsyncThunk(
  "loanMaster/fetchLoanMaster",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas.search;
      if (datas?.page) params.page = datas.page;
      if (datas?.size) params.size = datas.size;
      if (datas?.is_active) params.is_active = datas?.is_active;

      const response = await apiClient.get("/v1/loan-Master", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch loan Master"
      );
    }
  }
);
export const fetchLoanMasterById = createAsyncThunk(
  "loanMaster/fetchLoanMasterById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/loan-Master/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const addLoanMaster = createAsyncThunk(
  "loanMaster/addLoanMaster",
  async (loanMasterData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/loan-Master", loanMasterData),
        {
          loading: "Adding loan Master...",
          success: "Loan Master added successfully",
          error: "Failed to add loan Master",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add loan Master"
      );
    }
  }
);

export const updateLoanMaster = createAsyncThunk(
  "loanMaster/updateLoanMaster",
  async ({ id, loanMasterData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/loan-Master/${id}`, loanMasterData),
        {
          loading: "Updating loan Master...",
          success: "Loan Master updated successfully",
          error: "Failed to update loan Master",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({ status: 404, message: "Not found" });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update loan Master"
      );
    }
  }
);

export const deleteLoanMaster = createAsyncThunk(
  "loanMaster/deleteLoanMaster",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/loan-Master/${id}`),
        {
          loading: "Deleting loan Master...",
          success: "Loan Master deleted successfully",
          error: "Failed to delete loan Master",
        }
      );

      return {
        data: { id },
        message: response.data.message || "Loan Master deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete loan Master"
      );
    }
  }
);

const loanMasterSlice = createSlice({
  name: "loanMaster",
  initialState: {
    loanMaster: [],
    loanMasterDetail: null,
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
      .addCase(fetchLoanMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoanMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.loanMaster = action.payload.data;
      })
      .addCase(fetchLoanMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      .addCase(addLoanMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLoanMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.loanMaster = {
          ...state.loanMaster,
          data: [action.payload.data, ...(state.loanMaster?.data || [])],
        };
        state.success = action.payload.message;
      })
      .addCase(addLoanMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      .addCase(updateLoanMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLoanMaster.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.loanMaster?.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.loanMaster.data[index] = action.payload.data;
        }
        state.success = action.payload.message;
      })
      .addCase(updateLoanMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      .addCase(deleteLoanMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLoanMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.loanMaster = {
          ...state.loanMaster,
          data: state.loanMaster.data.filter(
            (item) => item.id !== action.payload.data.id
          ),
        };
        state.success = action.payload.message;
      })
      .addCase(deleteLoanMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })
      .addCase(fetchLoanMasterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoanMasterById.fulfilled, (state, action) => {
        state.loading = false;
        state.loanMasterDetail = action.payload.data;
      })
      .addCase(fetchLoanMasterById.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { clearMessages } = loanMasterSlice.actions;
export default loanMasterSlice.reducer;
