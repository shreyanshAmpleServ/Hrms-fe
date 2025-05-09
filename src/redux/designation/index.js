import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// designation Slice

// Fetch All designation
export const fetchdesignation = createAsyncThunk(
    "designation/fetchdesignation",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/designation", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch designation"
            );
        }
    }
);

// Add an designation
export const adddesignation = createAsyncThunk(
    "designation/adddesignation",
    async (designationData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/designation", designationData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add designation"
            );
        }
    }
);

// Update an designation
export const updatedesignation = createAsyncThunk(
    "designation/updatedesignation",
    async ({ id, designationData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/designation/${id}`, designationData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update designation"
            );
        }
    }
);

// Delete an designation
export const deletedesignation = createAsyncThunk(
    "designation/deletedesignation",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/designation/${id}`);
            return {
                data: { id },
                message: response.data.message || "designation deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete designation"
            );
        }
    }
);

const designationSlice = createSlice({
    name: "designation",
    initialState: {
        designation: [],
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
            .addCase(fetchdesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchdesignation.fulfilled, (state, action) => {
                state.loading = false;
                state.designation = action.payload.data;
            })
            .addCase(fetchdesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(adddesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adddesignation.fulfilled, (state, action) => {
                state.loading = false;
                state.designation = { ...state.designation, data: [action.payload.data, ...state.designation.data] };
                state.success = action.payload.message;
            })
            .addCase(adddesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updatedesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatedesignation.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.designation?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.designation.data[index] = action.payload.data;
                } else {
                    state.designation = { ...state.designation, data: [...state.designation, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updatedesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deletedesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletedesignation.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.designation.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.designation = { ...state.designation, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deletedesignation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = designationSlice.actions;
export default designationSlice.reducer;


