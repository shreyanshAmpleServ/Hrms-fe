import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all time sheet with optional filters (search, date range, pagination).
 */
export const fetchtrainingSession = createAsyncThunk(
    "trainingSession/fetchtrainingSession",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/training-session", {
                params,
            });
            return response// Returns list of  training Session
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  training Session"
            );
        }
    }
);

/**
 * Create a new time sheet.
 */
export const createtrainingSession = createAsyncThunk(
    "trainingSession/createtrainingSession",
    async (trainingSessionData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/training-session", trainingSessionData),
                {
                    loading: "Creating  Training Session...",
                    success: (res) =>
                        res.data.message || " Training session created successfully!",
                    error: "Failed to create  training session",
                }
            );
            return response.data; // Returns the newly created  training Session
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create  training session"
            );
        }
    }
);

/**
 * Update an existing time sheet by ID.
 */
export const updatetrainingSession = createAsyncThunk(
    "trainingSession/updatetrainingSession",
    async ({ id, trainingSessionData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/training-session/${id}`, trainingSessionData),
                {
                    loading: "Updating  Training Session...",
                    success: (res) =>
                        res.data.message || " Training session updated successfully!",
                    error: "Failed to update  training session",
                }
            );
            return response.data; // Returns the updated  training Session
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: " Training session not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update  training session"
            );
        }
    }
);

/**
 * Delete an time sheet by ID.
 */
export const deletetrainingSession = createAsyncThunk(
    "trainingSession/deletetrainingSession",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/training-session/${id}`),
                {
                    loading: "Deleting  Training Session...",
                    success: (res) =>
                        res.data.message || " Training Session deleted  successfully!",
                    error: "Failed to delete  training session",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || " Training Session deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete  training session"
            );
        }
    }
);

/**
 * Fetch a single time sheet by ID.
 */
export const fetchtrainingSessionById = createAsyncThunk(
    "trainingSession/fetchtrainingSessionById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/training-session/${id}`);
            return response.data; // Returns  training Session details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  training session"
            );
        }
    }
);

const trainingSessionSlice = createSlice({
    name: "trainingSession",
    initialState: {
        trainingSession: {},
        trainingSessionDetail: null,
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
            .addCase(fetchtrainingSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchtrainingSession.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingSession = action.payload.data;
            })
            .addCase(fetchtrainingSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create time sheet
            .addCase(createtrainingSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createtrainingSession.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingSession = {
                    ...state.trainingSession,
                    data: [...(state.trainingSession.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(createtrainingSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update time sheet
            .addCase(updatetrainingSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatetrainingSession.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.trainingSession.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.trainingSession.data[index] = action.payload.data;
                } else {
                    state.trainingSession = {
                        ...state.trainingSession,
                        data: [...(state.trainingSession.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updatetrainingSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete time sheet
            .addCase(deletetrainingSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletetrainingSession.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.trainingSession.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.trainingSession = { ...state.trainingSession, data: filterData };
                state.success = action.payload.message;
            })
            .addCase(deletetrainingSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch time sheet by ID
            .addCase(fetchtrainingSessionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchtrainingSessionById.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingSessionDetail = action.payload.data; // Consider renaming to trainingSessionDetail
            })
            .addCase(fetchtrainingSessionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = trainingSessionSlice.actions;
export default trainingSessionSlice.reducer;
