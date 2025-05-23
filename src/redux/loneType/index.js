import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// lone_type Slice loan-requests


// Fetch All lone_type
export const fetchlone_type = createAsyncThunk(
    "lone_type/fetchlone_type",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/loan-type", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch review-template"
            );
        }
    }
);

// Add an lone_type
export const addlone_type = createAsyncThunk(
    "lone_type/addlone_type",
    async (lone_typeData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/loan-type",
                lone_typeData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add lone_type"
            );
        }
    }
);

// Update an lone_type
export const updatelone_type = createAsyncThunk(
    "lone_type/updatelone_type",
    async ({ id, lone_typeData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/loan-type/${id}`, lone_typeData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update lone_type"
            );
        }
    }
);

// Delete an lone_type
export const deletelone_type = createAsyncThunk(
    "lone_type/deletelone_type",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/loan-type/${id}`);
            return {
                data: { id },
                message: response.data.message || "lone_type deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete lone_type"
            );
        }
    }
);

const lone_typeSlice = createSlice({
    name: "lone_type",
    initialState: {
        lone_type: [],
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
            .addCase(fetchlone_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchlone_type.fulfilled, (state, action) => {
                state.loading = false;
                state.lone_type = action.payload.data;
            })
            .addCase(fetchlone_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addlone_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addlone_type.fulfilled, (state, action) => {
                state.loading = false;
                state.lone_type = { ...state.lone_type, data: [action.payload.data, ...state.lone_type.data] };
                state.success = action.payload.message;
            })
            .addCase(addlone_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updatelone_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatelone_type.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.lone_type?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.lone_type.data[index] = action.payload.data;
                } else {
                    state.lone_type = { ...state.lone_type, data: [...state.lone_type, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updatelone_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deletelone_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletelone_type.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.lone_type.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.lone_type = { ...state.lone_type, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deletelone_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = lone_typeSlice.actions;
export default lone_typeSlice.reducer;


