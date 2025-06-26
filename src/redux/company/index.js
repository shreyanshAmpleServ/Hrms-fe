import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All Company
export const fetchCompany = createAsyncThunk(
  "company/fetchCompany",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/company", { params });
      return response.data; // Returns a list of company
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch company"
      );
    }
  }
);

// Add a Company
export const addCompany = createAsyncThunk(
  "company/addCompany",
  async (companyData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/company", companyData);
      return response.data; // Returns the newly added company
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add company"
      );
    }
  }
);

// Update a Company
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ companyData }, thunkAPI) => {
    try {
      const { id, ...data } = companyData;
      const response = await apiClient.put(`/v1/company/${id}`, { ...data });
      return response.data; // Returns the updated company
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Company not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update company"
      );
    }
  }
);

// Delete a Company
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/company/${id}`);
      return {
        data: { id },
        message: response.data.message || "Company deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete company"
      );
    }
  }
);

// Fetch a Single Company by ID
export const fetchCompanyById = createAsyncThunk(
  "company/fetchCompanyById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/company/${id}`);
      return response.data; // Returns the company details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch company"
      );
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    company: [],
    companyDetail: null,
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.data;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = {
          ...state.company,
          data: [action.payload.data, ...state.company.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.company.data?.findIndex(
          (company) => company.id === action.payload.data.id
        );
        if (index !== -1) {
          state.company.data[index] = action.payload.data;
        } else {
          state.company = {
            ...state.company,
            data: [action.payload.data, ...state.company.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        const filteredData = state.company.data.filter(
          (company) => company.id !== action.payload.data.id
        );
        state.company = { ...state.company, data: filteredData };
        state.success = action.payload.message;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetail = action.payload.data;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = companySlice.actions;
export default companySlice.reducer;
