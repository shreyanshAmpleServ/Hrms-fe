import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// review_template Slice

// Fetch All review_template
export const fetchreview_template = createAsyncThunk(
    "review_template/fetchreview_template",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/review-template", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch review-template"
            );
        }
    }
);

// Add an review_template
export const addreview_template = createAsyncThunk(
    "review_template/addreview_template",
    async (review_templateData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/review-template", review_templateData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add review_template"
            );
        }
    }
);

// Update an review_template
export const updatereview_template = createAsyncThunk(
    "review_template/updatereview_template",
    async ({ id, review_templateData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/review-template/${id}`, review_templateData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update review_template"
            );
        }
    }
);

// Delete an review_template
export const deletereview_template = createAsyncThunk(
    "review_template/deletereview_template",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/review-template/${id}`);
            return {
                data: { id },
                message: response.data.message || "review_template deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete review_template"
            );
        }
    }
);

const review_templateSlice = createSlice({
    name: "review_template",
    initialState: {
        review_template: [],
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
            .addCase(fetchreview_template.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchreview_template.fulfilled, (state, action) => {
                state.loading = false;
                state.review_template = action.payload.data;
            })
            .addCase(fetchreview_template.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addreview_template.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addreview_template.fulfilled, (state, action) => {
                state.loading = false;
                state.review_template = { ...state.review_template, data: [action.payload.data, ...state.review_template.data] };
                state.success = action.payload.message;
            })
            .addCase(addreview_template.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updatereview_template.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatereview_template.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.review_template?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.review_template.data[index] = action.payload.data;
                } else {
                    state.review_template = { ...state.review_template, data: [...state.review_template, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updatereview_template.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deletereview_template.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletereview_template.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.review_template.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.review_template = { ...state.review_template, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deletereview_template.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = review_templateSlice.actions;
export default review_templateSlice.reducer;


