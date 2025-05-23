import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all appointment letters with optional filters (search, date range, pagination).
 */
export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/appointment-letter", {
        params,
      });
      return response.data; // Returns list of appointment letters
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch appointments"
      );
    }
  }
);

/**
 * Create a new appointment letter.
 */
export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async (appointmentData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/appointment-letter", appointmentData),
        {
          loading: "Creating appointment...",
          success: (res) =>
            res.data.message || "Appointment created successfully!",
          error: "Failed to create appointment",
        }
      );
      return response.data; // Returns the newly created appointment
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create appointment"
      );
    }
  }
);

/**
 * Update an existing appointment letter by ID.
 */
export const updateAppointment = createAsyncThunk(
  "appointment/updateAppointment",
  async ({ id, appointmentData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/appointment-letter/${id}`, appointmentData),
        {
          loading: "Updating appointment...",
          success: (res) =>
            res.data.message || "Appointment updated successfully!",
          error: "Failed to update appointment",
        }
      );
      return response.data; // Returns the updated appointment
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Appointment not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update appointment"
      );
    }
  }
);

/**
 * Delete an appointment letter by ID.
 */
export const deleteAppointment = createAsyncThunk(
  "appointment/deleteAppointment",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/appointment-letter/${id}`);
      return {
        data: { id },
        message: response.data.message || "Appointment deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete appointment"
      );
    }
  }
);

/**
 * Fetch a single appointment letter by ID.
 */
export const fetchAppointmentById = createAsyncThunk(
  "appointment/fetchAppointmentById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/appointment-letter/${id}`);
      return response.data; // Returns appointment details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch appointment"
      );
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointment: {},
    campaignDetail: null, // Can be renamed to 'appointmentDetail' for clarity
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    // Clear success and error messages
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = action.payload.data;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = {
          ...state.appointment,
          data: [...(state.appointment.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointment.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.appointment.data[index] = action.payload.data;
        } else {
          state.appointment = {
            ...state.appointment,
            data: [...(state.appointment.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.appointment.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.appointment = { ...state.appointment, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch appointment by ID
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignDetail = action.payload.data; // Consider renaming to appointmentDetail
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = appointmentSlice.actions;
export default appointmentSlice.reducer;
