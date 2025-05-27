import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// employee_category Slice

// Fetch All employee_categorys
export const fetchemployee_category = createAsyncThunk(
  "employee_category/fetchemployee_category",
  async (datas, thunkAPI) => {
    try {
      let params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/employee-category", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employee_categorys"
      );
    }
  }
);

// Add an employee_category
export const addemployee_category = createAsyncThunk(
  "employee_category/addemployee_category",
  async (employee_categoryData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/employee-category", employee_categoryData),
        {
          loading: "Adding employee_category...",
          success: "Employee category added successfully",
          error: "Failed to add employee category",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add employee category"
      );
    }
  }
);

// Update an employee_category
export const updateemployee_category = createAsyncThunk(
  "employee_category/updateemployee_category",
  async ({ id, employee_categoryData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/employee-category/${id}`, employee_categoryData),
        {
          loading: "Updating employee_category...",
          success: "Employee category updated successfully",
          error: "Failed to update employee category",
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
        error.response?.data || "Failed to update employee_category"
      );
    }
  }
);

// Delete an employee_category
export const deleteemployee_category = createAsyncThunk(
  "employee_category/deleteemployee_category",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/employee-category/${id}`),
        {
          loading: "Deleting employee_category...",
          success: "Employee category deleted successfully",
          error: "Failed to delete employee category",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "employee_category deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete employee_category"
      );
    }
  }
);

const employee_categorysSlice = createSlice({
  name: "employee_category",
  initialState: {
    employee_category: [],
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
      .addCase(fetchemployee_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchemployee_category.fulfilled, (state, action) => {
        state.loading = false;
        state.employee_category = action.payload.data;
      })
      .addCase(fetchemployee_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addemployee_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addemployee_category.fulfilled, (state, action) => {
        state.loading = false;
        state.employee_category = {
          ...state.employee_category,
          data: [action.payload.data, ...state.employee_category.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addemployee_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateemployee_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateemployee_category.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employee_category?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.employee_category.data[index] = action.payload.data;
        } else {
          state.employee_category = {
            ...state.employee_category,
            data: [...state.employee_category, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateemployee_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteemployee_category.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteemployee_category.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.employee_category.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.employee_category = {
          ...state.employee_category,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deleteemployee_category.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = employee_categorysSlice.actions;
export default employee_categorysSlice.reducer;
