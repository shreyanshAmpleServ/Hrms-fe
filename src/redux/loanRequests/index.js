import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// loan_requests Slice loan-requests


// Fetch All loan_requests
export const fetchloan_requests = createAsyncThunk(
    "loan_requests/fetchloan_requests",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/loan-requests", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch review-template"
            );
        }
    }
);

// Add an loan_requests
export const addloan_requests = createAsyncThunk(
    "loan_requests/addloan_requests",
    async (loan_requestsData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/loan-requests",
                loan_requestsData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add loan_requests"
            );
        }
    }
);

// Update an loan_requests
export const updateloan_requests = createAsyncThunk(
    "loan_requests/updateloan_requests",
    async ({ id, loan_requestsData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/loan-requests/${id}`, loan_requestsData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update loan_requests"
            );
        }
    }
);

// Delete an loan_requests
export const deleteloan_requests = createAsyncThunk(
    "loan_requests/deleteloan_requests",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/loan-requests/${id}`);
            return {
                data: { id },
                message: response.data.message || "loan_requests deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete loan_requests"
            );
        }
    }
);

const loan_requestsSlice = createSlice({
    name: "loan_requests",
    initialState: {
        loan_requests: [],
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
            .addCase(fetchloan_requests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchloan_requests.fulfilled, (state, action) => {
                state.loading = false;
                state.loan_requests = action.payload.data;
            })
            .addCase(fetchloan_requests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addloan_requests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addloan_requests.fulfilled, (state, action) => {
                state.loading = false;
                state.loan_requests = { ...state.loan_requests, data: [action.payload.data, ...state.loan_requests.data] };
                state.success = action.payload.message;
            })
            .addCase(addloan_requests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateloan_requests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateloan_requests.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.loan_requests?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.loan_requests.data[index] = action.payload.data;
                } else {
                    state.loan_requests = { ...state.loan_requests, data: [...state.loan_requests, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updateloan_requests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteloan_requests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteloan_requests.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.loan_requests.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.loan_requests = { ...state.loan_requests, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deleteloan_requests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = loan_requestsSlice.actions;
export default loan_requestsSlice.reducer;


