import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// provident_fund Slice

// Fetch All provident_funds
export const fetchprovident_fund = createAsyncThunk(
    "provident_fund/fetchprovident_fund",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/provident_fund", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch provident_funds"
            );
        }
    }
);

// Add an provident_fund
export const addprovident_fund = createAsyncThunk(
    "provident_fund/addprovident_fund",
    async (provident_fundData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/provident_fund", provident_fundData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add provident_fund"
            );
        }
    }
);

// Update an provident_fund
export const updateprovident_fund = createAsyncThunk(
    "provident_fund/updateprovident_fund",
    async ({ id, provident_fundData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/provident_fund/${id}`, provident_fundData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update provident_fund"
            );
        }
    }
);

// Delete an provident_fund
export const deleteprovident_fund = createAsyncThunk(
    "provident_fund/deleteprovident_fund",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/provident_fund/${id}`);
            return {
                data: { id },
                message: response.data.message || "provident_fund deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete Provident_Fund"
            );
        }
    }
);

const provident_fundsSlice = createSlice({
    name: "provident_fund",
    initialState: {
        provident_fund: [],
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
            .addCase(fetchprovident_fund.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchprovident_fund.fulfilled, (state, action) => {
                state.loading = false;
                state.provident_fund = action.payload.data;
            })
            .addCase(fetchprovident_fund.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addprovident_fund.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addprovident_fund.fulfilled, (state, action) => {
                state.loading = false;
                state.provident_fund = { ...state.provident_fund, data: [action.payload.data, ...state.provident_fund.data] };
                state.success = action.payload.message;
            })
            .addCase(addprovident_fund.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateprovident_fund.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateprovident_fund.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.provident_fund?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.provident_fund.data[index] = action.payload.data;
                } else {
                    state.provident_fund = { ...state.provident_fund, data: [...state.provident_fund, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updateprovident_fund.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteprovident_fund.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteprovident_fund.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.provident_fund.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.provident_fund = { ...state.provident_fund, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deleteprovident_fund.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = provident_fundsSlice.actions;
export default provident_fundsSlice.reducer;


