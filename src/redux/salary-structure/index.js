import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiClient from "../../utils/axiosConfig";

export const fetchsalary_structure = createAsyncThunk(
  "salary_structure/fetchsalary_structure",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/salary-structure", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch salary_structures"
      );
    }
  }
);

// Add an salary_structure
export const addsalary_structure = createAsyncThunk(
  "salary_structure/addsalary_structure",
  async (salary_structureData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/salary-structure", salary_structureData),
        {
          loading: "Adding Salary Structure...",
          success: "Salary Structure added successfully",
          error: "Failed to add Salary Structure",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add salary_structure"
      );
    }
  }
);

// Update an salary_structure
export const updatesalary_structure = createAsyncThunk(
  "salary_structure/updatesalary_structure",
  async ({ id, salary_structureData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/salary-structure/${id}`, salary_structureData),
        {
          loading: "Updating Salary Structure...",
          success: "Salary Structure updated successfully",
          error: "Failed to update Salary Structure",
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
        error.response?.data || "Failed to update salary_structure"
      );
    }
  }
);

// Delete an salary_structure
export const deletesalary_structure = createAsyncThunk(
  "salary_structure/deletesalary_structure",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/salary-structure/${id}`),
        {
          loading: "Deleting Salary Structure...",
          success: "Salary Structure deleted successfully",
          error: "Failed to delete Salary Structure",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "salary_structure deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete salary_structure"
      );
    }
  }
);

const salary_structuresSlice = createSlice({
  name: "salary_structure",
  initialState: {
    salary_structure: [],
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
      .addCase(fetchsalary_structure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchsalary_structure.fulfilled, (state, action) => {
        state.loading = false;
        state.salary_structure = action.payload.data;
      })
      .addCase(fetchsalary_structure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addsalary_structure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addsalary_structure.fulfilled, (state, action) => {
        state.loading = false;
        state.salary_structure = {
          ...state.salary_structure,
          data: [action.payload.data, ...state.salary_structure.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addsalary_structure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatesalary_structure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatesalary_structure.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.salary_structure?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.salary_structure.data[index] = action.payload.data;
        } else {
          state.salary_structure = {
            ...state.salary_structure,
            data: [...state.salary_structure, action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updatesalary_structure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletesalary_structure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletesalary_structure.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.salary_structure.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.salary_structure = {
          ...state.salary_structure,
          data: filterData,
        };
        state.success = action.payload.message;
      })
      .addCase(deletesalary_structure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = salary_structuresSlice.actions;
export default salary_structuresSlice.reducer;
