import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all employment contracts with optional filters (search, date range, pagination).
 */
export const fetchContracts = createAsyncThunk(
  "contracts/fetchContracts",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
        candidate_id: datas?.candidate_id || "",
      };
      const response = await apiClient.get("/v1/employment-contract", {
        params,
      });
      return response.data; // Returns list of employment contracts
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employment contracts"
      );
    }
  }
);

/**
 * Create a new employment contract.
 */
export const createContract = createAsyncThunk(
  "contracts/createContract",
  async (contractData, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("candidate_id", contractData.candidate_id);
      formData.append(
        "contract_start_date",
        new Date(contractData.contract_start_date).toISOString()
      );
      formData.append(
        "contract_end_date",
        new Date(contractData.contract_end_date).toISOString()
      );
      formData.append("contract_type", contractData.contract_type);
      formData.append("document_path", contractData.document_path);
      console.log(contractData.document_path, "mkx");

      formData.append("description", contractData.description);
      const response = await toast.promise(
        apiClient.post("/v1/employment-contract", formData),
        {
          loading: "Creating employment contract...",
          success: (res) =>
            res.data.message || "Employment contract created successfully!",
          error: "Failed to create employment contract",
        }
      );
      return response.data; // Returns the newly created employment contract
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create employment contract"
      );
    }
  }
);

/**
 * Update an existing employment contract by ID.
 */
export const updateContract = createAsyncThunk(
  "contracts/updateContract",
  async ({ id, contractData }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("candidate_id", contractData.candidate_id);
      formData.append("contract_start_date", contractData.contract_start_date);
      formData.append("contract_end_date", contractData.contract_end_date);
      formData.append("contract_type", contractData.contract_type);
      formData.append("document_path", contractData.document_path);
      formData.append("description", contractData.description);
      const response = await toast.promise(
        apiClient.put(`/v1/employment-contract/${id}`, formData),
        {
          loading: "Updating employment contract...",
          success: (res) =>
            res.data.message || "Employment contract updated successfully!",
          error: "Failed to update employment contract",
        }
      );
      return response.data; // Returns the updated employment contract
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Employment contract not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update employment contract"
      );
    }
  }
);

/**
 * Delete an employment contract by ID.
 */
export const deleteContract = createAsyncThunk(
  "contracts/deleteContract",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/employment-contract/${id}`),
        {
          loading: "Deleting employment contract...",
          success: (res) =>
            res.data.message || "Employment contract deleted successfully!",
          error: "Failed to delete employment contract",
        }
      );
      return {
        data: { id },
        message:
          response.data.message || "Employment contract deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete employment contract"
      );
    }
  }
);

/**
 * Fetch a single employment contract by ID.
 */
export const fetchContractById = createAsyncThunk(
  "contracts/fetchContractById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/employment-contract/${id}`);
      return response.data; // Returns employment contract details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employment contract"
      );
    }
  }
);

const contractSlice = createSlice({
  name: "contracts",
  initialState: {
    contracts: {},
    contractDetail: null, // Can be renamed to 'contractDetail' for clarity
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
      // Fetch all employment contracts
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload.data;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Create employment contract
      .addCase(createContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = {
          ...state.contracts,
          data: [...(state.contracts.data || []), action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update employment contract
      .addCase(updateContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contracts.data?.findIndex(
          (item) => item.id === action.payload.data.id
        );
        if (index !== -1) {
          state.contracts.data[index] = action.payload.data;
        } else {
          state.contracts = {
            ...state.contracts,
            data: [...(state.contracts.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete employment contract
      .addCase(deleteContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.contracts.data?.filter(
          (item) => item.id !== action.payload.data.id
        );
        state.contracts = { ...state.contracts, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deleteContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch employment contract by ID
      .addCase(fetchContractById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.loading = false;
        state.contractDetail = action.payload.data; // Consider renaming to contractDetail
      })
      .addCase(fetchContractById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = contractSlice.actions;
export default contractSlice.reducer;
