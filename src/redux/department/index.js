import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

export const fetchdepartment = createAsyncThunk(
  "department/fetchdepartment",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/department", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch department"
      );
    }
  }
);

export const adddepartment = createAsyncThunk(
  "department/adddepartment",
  async (departmentData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/department", departmentData),
        {
          loading: "Adding department...",
          success: "Department added successfully",
          error: "Failed to add department",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add department"
      );
    }
  }
);

export const updatedepartment = createAsyncThunk(
  "department/updatedepartment",
  async ({ id, departmentData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/department/${id}`, departmentData),
        {
          loading: "Updating department...",
          success: "Department updated successfully",
          error: "Failed to update department",
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
        error.response?.data || "Failed to update department"
      );
    }
  }
);

export const deletedepartment = createAsyncThunk(
  "department/deletedepartment",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/department/${id}`),
        {
          loading: "Deleting department...",
          success: "Department deleted successfully",
          error: "Failed to delete department",
        }
      );
      return {
        data: { id },
        message: response.data.message || "department deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete department"
      );
    }
  }
);

const departmentSlice = createSlice({
  name: "department",
  initialState: {
    department: [],
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
      .addCase(fetchdepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchdepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.department = action.payload.data;
      })
      .addCase(fetchdepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(adddepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adddepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.department = {
          ...state.department,
          data: [action.payload.data, ...state.department.data],
        };
        state.success = action.payload.message;
      })
      .addCase(adddepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatedepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatedepartment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.department?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.department.data[index] = action.payload.data;
        } else {
          state.department = {
            ...state.department,
            data: [...state.department, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatedepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletedepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletedepartment.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.department.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.department = { ...state.department, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deletedepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = departmentSlice.actions;
export default departmentSlice.reducer;
