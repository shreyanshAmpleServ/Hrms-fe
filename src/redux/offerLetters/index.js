import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// offer_letter Slice

// Fetch All offer_letter
export const fetchoffer_letter = createAsyncThunk(
    "offer_letter/fetchoffer_letter",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/offer-letter", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch review-template"
            );
        }
    }
);

// Add an offer_letter
export const addoffer_letter = createAsyncThunk(
    "offer_letter/addoffer_letter",
    async (offer_letterData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/offer-letter",
                offer_letterData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add offer_letter"
            );
        }
    }
);

// Update an offer_letter
export const updateoffer_letter = createAsyncThunk(
    "offer_letter/updateoffer_letter",
    async ({ id, offer_letterData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/offer-letter/${id}`, offer_letterData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update offer_letter"
            );
        }
    }
);

// Delete an offer_letter
export const deleteoffer_letter = createAsyncThunk(
    "offer_letter/deleteoffer_letter",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/offer-letter/${id}`);
            return {
                data: { id },
                message: response.data.message || "offer_letter deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete offer_letter"
            );
        }
    }
);

const offer_letterSlice = createSlice({
    name: "offer_letter",
    initialState: {
        offer_letter: [],
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
            .addCase(fetchoffer_letter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchoffer_letter.fulfilled, (state, action) => {
                state.loading = false;
                state.offer_letter = action.payload.data;
            })
            .addCase(fetchoffer_letter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addoffer_letter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addoffer_letter.fulfilled, (state, action) => {
                state.loading = false;
                state.offer_letter = { ...state.offer_letter, data: [action.payload.data, ...state.offer_letter.data] };
                state.success = action.payload.message;
            })
            .addCase(addoffer_letter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateoffer_letter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateoffer_letter.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.offer_letter?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.offer_letter.data[index] = action.payload.data;
                } else {
                    state.offer_letter = { ...state.offer_letter, data: [...state.offer_letter, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updateoffer_letter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteoffer_letter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteoffer_letter.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.offer_letter.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.offer_letter = { ...state.offer_letter, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deleteoffer_letter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = offer_letterSlice.actions;
export default offer_letterSlice.reducer;


