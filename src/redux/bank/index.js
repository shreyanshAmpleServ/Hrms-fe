import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// bank Slice

// Fetch All bank
export const fetchbank = createAsyncThunk(
  "bank/fetchbank",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/bank-master", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch bank"
      );
    }
  }
);

// Add an bank
export const addbank = createAsyncThunk(
  "bank/addbank",
  async (bankData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/bank-master", bankData),
        {
          loading: "Adding bank...",
          success: "Bank added successfully",
          error: "Failed to add bank",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add bank"
      );
    }
  }
);

// Update an bank
export const updatebank = createAsyncThunk(
  "bank/updatebank",
  async ({ id, bankData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/bank-master/${id}`, bankData),
        {
          loading: "Updating bank...",
          success: "Bank updated successfully",
          error: "Failed to update bank",
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
        error.response?.data || "Failed to update bank"
      );
    }
  }
);

// Delete an bank
export const deletebank = createAsyncThunk(
  "bank/deletebank",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/bank-master/${id}`),
        {
          loading: "Deleting bank...",
          success: "Bank deleted successfully",
          error: "Failed to delete bank",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Bank deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete bank"
      );
    }
  }
);

const bankSlice = createSlice({
  name: "bank",
  initialState: {
    bank: [],
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
      .addCase(fetchbank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchbank.fulfilled, (state, action) => {
        state.loading = false;
        state.bank = action.payload.data;
      })
      .addCase(fetchbank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addbank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addbank.fulfilled, (state, action) => {
        state.loading = false;
        state.bank = {
          ...state.bank,
          data: [action.payload.data, ...state.bank.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addbank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatebank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatebank.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bank?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.bank.data[index] = action.payload.data;
        } else {
          state.bank = {
            ...state.bank,
            data: [...state.bank, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatebank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletebank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletebank.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.bank.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.bank = { ...state.bank, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletebank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = bankSlice.actions;
export default bankSlice.reducer;
