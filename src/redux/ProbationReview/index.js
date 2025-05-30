import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";
/** probationReview  {


 * Fetch all time sheet with optional filters (search, date range, pagination).
 */
export const fetchprobationReview = createAsyncThunk(
    "probationReview/fetchprobationReview",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/probation-review", {
                params,
            });
            return response.data; // Returns list of  probation Review
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  probation Review"
            );
        }
    }
);

/**
 * Create a new time sheet.
 */
export const createprobationReview = createAsyncThunk(
    "probationReview/createprobationReview",
    async (probationReviewData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/probation-review", probationReviewData),
                {
                    loading: "Creating  probation Review...",
                    success: (res) =>
                        res.data.message || " probation Review created successfully!",
                    error: "Failed to create  probation Review",
                }

            );
            return response.data; // Returns the newly created  probation Review
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create  probation Review"
            );
        }
    }
);

/**
 * Update an existing time sheet by ID.
 */
export const updateprobationReview = createAsyncThunk(
    "probationReview/updateprobationReview",
    async ({ id, probationReviewData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/probation-review/${id}`, probationReviewData),
                {
                    loading: "Updating  probation Review...",
                    success: (res) =>
                        res.data.message || " probation Review updated successfully!",
                    error: "Failed to update  probation Review",
                }
            );
            return response.data; // Returns the updated  probation Review
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: " probation Review not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update  probation Review"
            );
        }
    }
);

/**
 * Delete an time sheet by ID.
 */
export const deleteprobationReview = createAsyncThunk(
    "probationReview/deleteprobationReview",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/probation-review/${id}`),
                {
                    loading: "Deleting  probation Review...",
                    success: (res) =>
                        res.data.message || " probation Review deleted  successfully!",
                    error: "Failed to delete  probation Review",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || " probation Review deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete  probation Review"
            );
        }
    }
);

/**
 * Fetch a single time sheet by ID.
 */
export const fetchprobationReviewById = createAsyncThunk(
    "probationReview/fetchprobationReviewById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/probation-review/${id}`);
            return response.data; // Returns  probation Review details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  probation Review"
            );
        }
    }
);

const probationReviewSlice = createSlice({
    name: "probationReview",
    initialState: {
        probationReview: {},
        probationReviewDetail: null,
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
            // Fetch all time sheet
            .addCase(fetchprobationReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchprobationReview.fulfilled, (state, action) => {
                state.loading = false;
                state.probationReview = action.payload.data;
            })
            .addCase(fetchprobationReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create time sheet
            .addCase(createprobationReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createprobationReview.fulfilled, (state, action) => {
                state.loading = false;
                state.probationReview = {
                    ...state.probationReview,
                    data: [...(state.probationReview.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(createprobationReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update time sheet
            .addCase(updateprobationReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateprobationReview.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.probationReview.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.probationReview.data[index] = action.payload.data;
                } else {
                    state.probationReview = {
                        ...state.probationReview,
                        data: [...(state.probationReview.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updateprobationReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete time sheet
            .addCase(deleteprobationReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteprobationReview.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.probationReview.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.probationReview = { ...state.probationReview, data: filterData };
                state.success = action.payload.message;
            })
            .addCase(deleteprobationReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch time sheet by ID
            .addCase(fetchprobationReviewById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchprobationReviewById.fulfilled, (state, action) => {
                state.loading = false;
                state.probationReviewDetail = action.payload.data; // Consider renaming to probationReviewDetail
            })
            .addCase(fetchprobationReviewById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = probationReviewSlice.actions;
export default probationReviewSlice.reducer;
