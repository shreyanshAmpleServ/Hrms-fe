import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all helpdesk ticket with optional filters (search, date range, pagination).
 */
export const fetchHelpdeskTicket = createAsyncThunk(
  "helpdeskTicket/fetchHelpdeskTicket",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/helpdesk-ticket", {
        params,
      });
      return response.data; // Returns list of helpdesk ticket
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch helpdesk ticket"
      );
    }
  }
);

/**
 * Create a new helpdesk ticket.
 */
export const createHelpdeskTicket = createAsyncThunk(
  "helpdeskTicket/createHelpdeskTicket",
  async (helpdeskTicketData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/helpdesk-ticket", helpdeskTicketData),
        {
          loading: "Creating helpdesk ticket...",
          success: (res) =>
            res.data.message || "helpdesk ticket created successfully!",
          error: "Failed to create helpdesk ticket",
        }
      );
      return response.data; // Returns the newly created helpdesk ticket
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create helpdesk ticket"
      );
    }
  }
);

/**
 * Update an existing helpdesk ticket by ID.
 */
export const updateHelpdeskTicket = createAsyncThunk(
  "helpdeskTicket/updateHelpdeskTicket",
  async ({ id, helpdeskTicketData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/helpdesk-ticket/${id}`, helpdeskTicketData),
        {
          loading: "Updating helpdesk ticket...",
          success: (res) =>
            res.data.message || "helpdesk ticket updated successfully!",
          error: "Failed to update helpdesk ticket",
        }
      );
      return response.data; // Returns the updated helpdesk ticket
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "helpdesk ticket not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update helpdesk ticket"
      );
    }
  }
);

/**
 * Delete an helpdesk ticket by ID.
 */
export const deleteHelpdeskTicket = createAsyncThunk(
  "helpdeskTicket/deleteHelpdeskTicket",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/helpdesk-ticket/${id}`),
        {
          loading: "Deleting helpdesk ticket...",
          success: (res) =>
            res.data.message || "helpdesk ticket deleted successfully!",
          error: "Failed to delete helpdesk ticket",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "helpdesk ticket deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete helpdesk ticket"
      );
    }
  }
);

/**
 * Fetch a single helpdesk ticket by ID.
 */
export const fetchHelpdeskTicketById = createAsyncThunk(
  "helpdeskTicket/fetchHelpdeskTicketById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/helpdesk-ticket/${id}`);
      return response.data; // Returns helpdesk ticket details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch helpdesk ticket"
      );
    }
  }
);

const helpdeskTicketSlice = createSlice({
  name: "helpdeskTicket",
  initialState: {
    helpdeskTicket: {},
    helpdeskTicketDetail: null,
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
      // Fetch all helpdesk ticket
      .addCase(fetchHelpdeskTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHelpdeskTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.helpdeskTicket = action.payload.data;
      })
      .addCase(fetchHelpdeskTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create helpdesk ticket
      .addCase(createHelpdeskTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHelpdeskTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.helpdeskTicket = {
          ...state.helpdeskTicket,
          data: [...(state.helpdeskTicket.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createHelpdeskTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update helpdesk ticket
      .addCase(updateHelpdeskTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHelpdeskTicket.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.helpdeskTicket.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.helpdeskTicket.data[index] = action.payload.data;
        } else {
          state.helpdeskTicket = {
            ...state.helpdeskTicket,
            data: [...(state.helpdeskTicket.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateHelpdeskTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete helpdesk ticket
      .addCase(deleteHelpdeskTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHelpdeskTicket.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.helpdeskTicket.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.helpdeskTicket = {
          ...state.helpdeskTicket,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteHelpdeskTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch helpdesk ticket by ID
      .addCase(fetchHelpdeskTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHelpdeskTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.helpdeskTicketDetail = action.payload.data;
      })
      .addCase(fetchHelpdeskTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = helpdeskTicketSlice.actions;
export default helpdeskTicketSlice.reducer;
