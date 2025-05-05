import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// bank Slice

// Fetch All banks
export const fetchBank = createAsyncThunk(
    "banks/fetchBank",
    async (datas, thunkAPI) => {
        try {
            const params  ={}
            if(datas?.search) params.search = datas?.search
            if(datas?.page) params.page = datas?.page
            if(datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/bank-master",{params});
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch banks"
            );
        }
    }
);

// Add an bank
export const addBank = createAsyncThunk(
    "banks/addBank",
    async (bankData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/bank-master", bankData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add bank"
            );
        }
    }
);

// Update an bank
export const updateBank = createAsyncThunk(
    "banks/updateBank",
    async ({ id, bankData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/bank-master/${id}`, bankData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update bank"
            );
        }
    }
);

// Delete an bank
export const deleteBank = createAsyncThunk(
    "banks/deleteBank",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/bank-master/${id}`);
            return {
                data: { id },
                message: response.data.message || "bank deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete bank"
            );
        }
    }
);

const banksSlice = createSlice({
    name: "banks",
    initialState: {
        banks: [],
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
            .addCase(fetchBank.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBank.fulfilled, (state, action) => {
                state.loading = false;
                state.banks = action.payload.data;
            })
            .addCase(fetchBank.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addBank.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBank.fulfilled, (state, action) => {
                state.loading = false;
                state.banks ={...state.banks, data: [action.payload.data, ...state.banks.data]}; 
                state.success = action.payload.message;
            })
            .addCase(addBank.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateBank.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBank.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.banks?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.banks.data[index] = action.payload.data;
                } else {
                    state.banks ={...state.banks, data: [ ...state.banks,action.payload.data]};
                }
                state.success = action.payload.message;
            })
            .addCase(updateBank.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteBank.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBank.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.banks.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.banks= {...state.banks,data:filterData}
                state.success = action.payload.message;
            })
            .addCase(deleteBank.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = banksSlice.actions;
export default banksSlice.reducer;


