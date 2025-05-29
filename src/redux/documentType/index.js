import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All document_type
export const fetchdocument_type = createAsyncThunk(
  "document_type/fetchdocument_type",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/document-Type", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch document_type"
      );
    }
  }
);

// Add an document_type
export const adddocument_type = createAsyncThunk(
  "document_type/adddocument_type",
  async (document_typeData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/document-Type", document_typeData),
        {
          loading: "Adding Document Type...",
          success: "Document Type added successfully",
          error: "Failed to add Document Type",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add document_type"
      );
    }
  }
);

// Update an document_type
export const updatedocument_type = createAsyncThunk(
  "document_type/updatedocument_type",
  async ({ id, document_typeData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/document-Type/${id}`, document_typeData),
        {
          loading: "Updating Document Type...",
          success: "Document Type updated successfully",
          error: "Failed to update Document Type",
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
        error.response?.data || "Failed to update document_type"
      );
    }
  }
);

// Delete an document_type
export const deletedocument_type = createAsyncThunk(
  "document_type/deletedocument_type",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/document-Type/${id}`),
        {
          loading: "Deleting Document Type...",
          success: "Document Type deleted successfully",
          error: "Failed to delete Document Type",
        }
      );
      return {
        data: { id },
        message: response.data.message || "Document Type deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete document_type"
      );
    }
  }
);

const document_typeSlice = createSlice({
  name: "document_type",
  initialState: {
    document_type: [],
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
      .addCase(fetchdocument_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchdocument_type.fulfilled, (state, action) => {
        state.loading = false;
        state.document_type = action.payload.data;
      })
      .addCase(fetchdocument_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(adddocument_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adddocument_type.fulfilled, (state, action) => {
        state.loading = false;
        state.document_type = {
          ...state.document_type,
          data: [action.payload.data, ...state.document_type.data],
        };
        state.success = action.payload.message;
      })
      .addCase(adddocument_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatedocument_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatedocument_type.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.document_type?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.document_type.data[index] = action.payload.data;
        } else {
          state.document_type = {
            ...state.document_type,
            data: [...state.document_type, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatedocument_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletedocument_type.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletedocument_type.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.document_type.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.document_type = { ...state.document_type, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletedocument_type.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = document_typeSlice.actions;
export default document_typeSlice.reducer;
