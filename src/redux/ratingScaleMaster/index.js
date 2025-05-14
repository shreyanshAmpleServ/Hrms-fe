import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// rating_scale Slice

// Fetch All rating_scale
export const fetchrating_scale = createAsyncThunk(
    "rating_scale/fetchrating_scale",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/rating-scale", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch review-template"
            );
        }
    }
);

// Add an rating_scale
export const addrating_scale = createAsyncThunk(
    "rating_scale/addrating_scale",
    async (rating_scaleData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/rating-scale", rating_scaleData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add rating_scale"
            );
        }
    }
);

// Update an rating_scale
export const updaterating_scale = createAsyncThunk(
    "rating_scale/updaterating_scale",
    async ({ id, rating_scaleData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/rating-scale/${id}`, rating_scaleData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update rating_scale"
            );
        }
    }
);

// Delete an rating_scale
export const deleterating_scale = createAsyncThunk(
    "rating_scale/deleterating_scale",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/rating-scale/${id}`);
            return {
                data: { id },
                message: response.data.message || "rating_scale deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete rating_scale"
            );
        }
    }
);

const rating_scaleSlice = createSlice({
    name: "rating_scale",
    initialState: {
        rating_scale: [],
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
            .addCase(fetchrating_scale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchrating_scale.fulfilled, (state, action) => {
                state.loading = false;
                state.rating_scale = action.payload.data;
            })
            .addCase(fetchrating_scale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addrating_scale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addrating_scale.fulfilled, (state, action) => {
                state.loading = false;
                state.rating_scale = { ...state.rating_scale, data: [action.payload.data, ...state.rating_scale.data] };
                state.success = action.payload.message;
            })
            .addCase(addrating_scale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updaterating_scale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updaterating_scale.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.rating_scale?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.rating_scale.data[index] = action.payload.data;
                } else {
                    state.rating_scale = { ...state.rating_scale, data: [...state.rating_scale, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updaterating_scale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleterating_scale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleterating_scale.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.rating_scale.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.rating_scale = { ...state.rating_scale, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deleterating_scale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = rating_scaleSlice.actions;
export default rating_scaleSlice.reducer;


