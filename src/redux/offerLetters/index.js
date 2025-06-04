import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/** offer_letter
 * Fetch all offer_letter with optional filters (search, date range, pagination).
 */
export const fetchoffer_letter = createAsyncThunk(
    "offer_letter/fetchoffer_letter",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/offer-letter", {
                params,
            });
            return response.data; // Returns list of offer_letter
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch offer letter"
            );
        }
    }
);

/**
 * Create a new offer_letter.
 */
export const addoffer_letter = createAsyncThunk(
    "offer_letter/addoffer_letter",
    async (offer_letterData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/offer-letter", offer_letterData),
                {
                    loading: "Creating offer_letter...",
                    success: (res) =>
                        res.data.message || "offer letter created successfully!",
                    error: "Failed to create offer_letter",
                }
            );
            return response.data; // Returns the newly created offer_letter
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create offer_letter"
            );
        }
    }
);

/**
 * Update an existing offer_letter by ID.
 */
export const updateoffer_letter = createAsyncThunk(
    "offer_letter/updateoffer_letter",
    async ({ id, offer_letterData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/offer-letter/${id}`, offer_letterData),
                {
                    loading: "Updating offer_letter...",
                    success: (res) =>
                        res.data.message || "offer_letter updated successfully!",
                    error: "Failed to update offer_letter",
                }
            );
            return response.data; // Returns the updated offer_letter
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "offer_letter not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update offer_letter"
            );
        }
    }
);

/**
 * Delete an offer_letter by ID.
 */
export const deleteoffer_letter = createAsyncThunk(
    "offer_letter/deleteoffer_letter",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/offer-letter/${id}`),
                {
                    loading: "Deleting offer_letter...",
                    success: (res) =>
                        res.data.message || "offer_letter deleted successfully!",
                    error: "Failed to delete offer_letter",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || "offer_letter deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete offer_letter"
            );
        }
    }
);

/**
 * Fetch a single offer_letter by ID.
 */
export const fetchoffer_letterById = createAsyncThunk(
    "offer_letter/fetchoffer_letterById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/offer-letter/${id}`);
            return response.data; // Returns offer_letter details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch offer_letter"
            );
        }
    }
);

const offer_letterSlice = createSlice({
    name: "offer_letter",
    initialState: {
        offer_letter: {},
        offer_letterDetail: null,
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
            // Fetch all offer_letter
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

            // Create offer_letter
            .addCase(addoffer_letter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addoffer_letter.fulfilled, (state, action) => {
                state.loading = false;
                state.offer_letter = {
                    ...state.offer_letter,
                    data: [...(state.offer_letter.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(addoffer_letter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update offer_letter
            .addCase(updateoffer_letter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateoffer_letter.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.offer_letter.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.offer_letter.data[index] = action.payload.data;
                } else {
                    state.offer_letter = {
                        ...state.offer_letter,
                        data: [...(state.offer_letter.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updateoffer_letter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete offer_letter
            .addCase(deleteoffer_letter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteoffer_letter.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.offer_letter.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.offer_letter = {
                    ...state.offer_letter,
                    data: filterData,
                };
                state.success = action.payload.message;
            })
            .addCase(deleteoffer_letter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch offer_letter by ID
            .addCase(fetchoffer_letterById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchoffer_letterById.fulfilled, (state, action) => {
                state.loading = false;
                state.offer_letterDetail = action.payload.data;
            })
            .addCase(fetchoffer_letterById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = offer_letterSlice.actions;
export default offer_letterSlice.reducer;
