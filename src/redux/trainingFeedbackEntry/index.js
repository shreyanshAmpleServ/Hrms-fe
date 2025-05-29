import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";
/** trainingFeedback

 * Fetch all time sheet with optional filters (search, date range, pagination).
 */
export const fetchtrainingFeedback = createAsyncThunk(
    "trainingFeedback/fetchtrainingFeedback",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/training-feedback", {
                params,
            });
            return response.data; // Returns list of  training Feedback
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  training Feedback"
            );
        }
    }
);

/**
 * Create a new time sheet.
 */
export const createtrainingFeedback = createAsyncThunk(
    "trainingFeedback/createtrainingFeedback",
    async (trainingFeedbackData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/training-feedback", trainingFeedbackData),
                {
                    loading: "Creating  training Feedback...",
                    success: (res) =>
                        res.data.message || " training Feedback created successfully!",
                    error: "Failed to create  training Feedback",
                }

            );
            return response.data; // Returns the newly created  training Feedback
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create  training Feedback"
            );
        }
    }
);

/**
 * Update an existing time sheet by ID.
 */
export const updatetrainingFeedback = createAsyncThunk(
    "trainingFeedback/updatetrainingFeedback",
    async ({ id, trainingFeedbackData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/training-feedback/${id}`, trainingFeedbackData),
                {
                    loading: "Updating  training Feedback...",
                    success: (res) =>
                        res.data.message || " training Feedback updated successfully!",
                    error: "Failed to update  training Feedback",
                }
            );
            return response.data; // Returns the updated  training Feedback
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: " training Feedback not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update  training Feedback"
            );
        }
    }
);

/**
 * Delete an time sheet by ID.
 */
export const deletetrainingFeedback = createAsyncThunk(
    "trainingFeedback/deletetrainingFeedback",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/training-feedback/${id}`),
                {
                    loading: "Deleting  training Feedback...",
                    success: (res) =>
                        res.data.message || " training Feedback deleted  successfully!",
                    error: "Failed to delete  training Feedback",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || " training Feedback deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete  training Feedback"
            );
        }
    }
);

/**
 * Fetch a single time sheet by ID.
 */
export const fetchtrainingFeedbackById = createAsyncThunk(
    "trainingFeedback/fetchtrainingFeedbackById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/training-feedback/${id}`);
            return response.data; // Returns  training Feedback details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  training Feedback"
            );
        }
    }
);

const trainingFeedbackSlice = createSlice({
    name: "trainingFeedback",
    initialState: {
        trainingFeedback: {},
        trainingFeedbackDetail: null,
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
            .addCase(fetchtrainingFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchtrainingFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingFeedback = action.payload.data;
            })
            .addCase(fetchtrainingFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create time sheet
            .addCase(createtrainingFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createtrainingFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingFeedback = {
                    ...state.trainingFeedback,
                    data: [...(state.trainingFeedback.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(createtrainingFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update time sheet
            .addCase(updatetrainingFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatetrainingFeedback.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.trainingFeedback.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.trainingFeedback.data[index] = action.payload.data;
                } else {
                    state.trainingFeedback = {
                        ...state.trainingFeedback,
                        data: [...(state.trainingFeedback.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updatetrainingFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete time sheet
            .addCase(deletetrainingFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletetrainingFeedback.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.trainingFeedback.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.trainingFeedback = { ...state.trainingFeedback, data: filterData };
                state.success = action.payload.message;
            })
            .addCase(deletetrainingFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch time sheet by ID
            .addCase(fetchtrainingFeedbackById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchtrainingFeedbackById.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingFeedbackDetail = action.payload.data; // Consider renaming to trainingFeedbackDetail
            })
            .addCase(fetchtrainingFeedbackById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = trainingFeedbackSlice.actions;
export default trainingFeedbackSlice.reducer;
