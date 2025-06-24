import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all medical record with optional filters (search, date range, pagination).
 */
export const fetchMedicalRecord = createAsyncThunk(
  "medicalRecord/fetchMedicalRecord",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/medical-record", {
        params,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch medical record"
      );
    }
  }
);

/**
 * Create a new medical record.
 */
export const createMedicalRecord = createAsyncThunk(
  "medicalRecord/createMedicalRecord",
  async (medicalRecordData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/medical-record", medicalRecordData),
        {
          loading: "Creating medical record...",
          success: (res) =>
            res.data.message || "medical record created successfully!",
          error: "Failed to create medical record",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create medical record"
      );
    }
  }
);

/**
 * Update an existing medical record by ID.
 */
export const updateMedicalRecord = createAsyncThunk(
  "medicalRecord/updateMedicalRecord",
  async ({ id, medicalRecordData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/medical-record/${id}`, medicalRecordData),
        {
          loading: "Updating medical record...",
          success: (res) =>
            res.data.message || "medical record updated successfully!",
          error: "Failed to update medical record",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "medical record not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update medical record"
      );
    }
  }
);

/**
 * Delete an medical record by ID.
 */
export const deleteMedicalRecord = createAsyncThunk(
  "medicalRecord/deleteMedicalRecord",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/medical-record/${id}`),
        {
          loading: "Deleting medical record...",
          success: (res) =>
            res.data.message || "medical record deleted successfully!",
          error: "Failed to delete medical record",
        }
      );
      return {
        data: { id },
        message: response.data.message || "medical record deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete medical record"
      );
    }
  }
);

/**
 * Fetch a single medical record by ID.
 */
export const fetchMedicalRecordById = createAsyncThunk(
  "medicalRecord/fetchMedicalRecordById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/medical-record/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch medical record"
      );
    }
  }
);

const medicalRecordSlice = createSlice({
  name: "medicalRecord",
  initialState: {
    medicalRecord: {},
    medicalRecordDetail: null,
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
      .addCase(fetchMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalRecord = action.payload.data;
      })
      .addCase(fetchMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(createMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalRecord = {
          ...state.medicalRecord,
          data: [...(state.medicalRecord.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(updateMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.medicalRecord.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.medicalRecord.data[index] = action.payload.data;
        } else {
          state.medicalRecord = {
            ...state.medicalRecord,
            data: [...(state.medicalRecord.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(deleteMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.medicalRecord.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.medicalRecord = {
          ...state.medicalRecord,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(fetchMedicalRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalRecordDetail = action.payload.data;
      })
      .addCase(fetchMedicalRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer;
