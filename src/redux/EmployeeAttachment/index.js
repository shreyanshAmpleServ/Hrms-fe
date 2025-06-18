import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all Employee Attachment with optional filters (search, date range, pagination).
 */
export const fetchEmployeeAttachment = createAsyncThunk(
  "employeeAttachment/fetchEmployeeAttachment",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        employeeId: datas?.employeeId || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };

      const response = await apiClient.get("/v1/document-upload", {
        params,
      });
      return response.data; // Returns list of Employee Attachment
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Employee Attachment"
      );
    }
  }
);

/**
 * Create a new Employee Attachment.
 */
export const createEmployeeAttachment = createAsyncThunk(
  "employeeAttachment/createEmployeeAttachment",
  async (employeeAttachmentData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/document-upload", employeeAttachmentData),
        {
          loading: "Creating Employee Attachment...",
          success: (res) =>
            res.data.message || "Employee Attachment created successfully!",
          error: "Failed to create Employee Attachment",
        }
      );
      return response.data; // Returns the newly created Employee Attachment
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create Employee Attachment"
      );
    }
  }
);

/**
 * Update an existing Employee Attachment by ID.
 */
export const updateEmployeeAttachment = createAsyncThunk(
  "employeeAttachment/updateEmployeeAttachment",
  async (employeeAttachmentData, thunkAPI) => {
    const id = employeeAttachmentData.get("id");
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/document-upload/${id}`, employeeAttachmentData),
        {
          loading: "Updating Employee Attachment...",
          success: (res) =>
            res.data.message || "Employee Attachment updated successfully!",
          error: "Failed to update Employee Attachment",
        }
      );
      return response.data; // Returns the updated Employee Attachment
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Employee Attachment not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update Employee Attachment"
      );
    }
  }
);

/**
 * Delete an Employee Attachment by ID.
 */
export const deleteEmployeeAttachment = createAsyncThunk(
  "employeeAttachment/deleteEmployeeAttachment",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/document-upload/${id}`),
        {
          loading: "Deleting Employee Attachment...",
          success: (res) =>
            res.data.message || "Employee Attachment deleted successfully!",
          error: "Failed to delete Employee Attachment",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Employee Attachment deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete Employee Attachment"
      );
    }
  }
);

/**
 * Fetch a single Employee Attachment by ID.
 */
export const fetchEmployeeAttachmentById = createAsyncThunk(
  "employeeAttachment/fetchEmployeeAttachmentById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/document-upload/${id}`);
      return response.data; // Returns Employee Attachment details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Employee Attachment"
      );
    }
  }
);

const employeeAttachmentSlice = createSlice({
  name: "employeeAttachment",
  initialState: {
    employeeAttachment: {},
    employeeAttachmentDetail: null,
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
      // Fetch all Employee Attachment
      .addCase(fetchEmployeeAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAttachment.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeAttachment = action.payload.data;
      })
      .addCase(fetchEmployeeAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create Employee Attachment
      .addCase(createEmployeeAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeeAttachment.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeAttachment = {
          ...state.employeeAttachment,
          data: [...(state.employeeAttachment.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createEmployeeAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update Employee Attachment
      .addCase(updateEmployeeAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeAttachment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employeeAttachment.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.employeeAttachment.data[index] = action.payload.data;
        } else {
          state.employeeAttachment = {
            ...state.employeeAttachment,
            data: [
              ...(state.employeeAttachment.data || []),
              action.payload.data,
            ],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateEmployeeAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete Employee Attachment
      .addCase(deleteEmployeeAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeAttachment.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.employeeAttachment.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.employeeAttachment = {
          ...state.employeeAttachment,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteEmployeeAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch Employee Attachment by ID
      .addCase(fetchEmployeeAttachmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAttachmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeAttachmentDetail = action.payload.data;
      })
      .addCase(fetchEmployeeAttachmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = employeeAttachmentSlice.actions;
export default employeeAttachmentSlice.reducer;
