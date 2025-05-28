import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all time sheet with optional filters (search, date range, pagination).
 */
export const fetchgrievanceSubmission = createAsyncThunk(
    "grievanceSubmission/fetchgrievanceSubmission",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/disciplinary-action", {
                params,
            });
            return response.data; // Returns list of grievance Submission
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch grievance Submission"
            );
        }
    }
);

/**
 * Create a new time sheet.
 */
export const creategrievanceSubmission = createAsyncThunk(
    "grievanceSubmission/creategrievanceSubmission",
    async (grievanceSubmissionData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/disciplinary-action", grievanceSubmissionData),
                {
                    loading: "Creating grievance Submission...",
                    success: (res) =>
                        res.data.message || "grievance Submission created successfully!",
                    error: "Failed to create grievance Submission",
                }
            );
            return response.data; // Returns the newly created grievance Submission
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create grievance Submission"
            );
        }
    }
);

/**
 * Update an existing time sheet by ID.
 */
export const updategrievanceSubmission = createAsyncThunk(
    "grievanceSubmission/updategrievanceSubmission",
    async ({ id, grievanceSubmissionData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/disciplinary-action/${id}`, grievanceSubmissionData),
                {
                    loading: "Updating grievance Submission...",
                    success: (res) =>
                        res.data.message || "grievance Submission updated successfully!",
                    error: "Failed to update grievance Submission",
                }
            );
            return response.data; // Returns the updated grievance Submission
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "grievance Submission not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update grievance Submission"
            );
        }
    }
);

/**
 * Delete an time sheet by ID.
 */
export const deletegrievanceSubmission = createAsyncThunk(
    "grievanceSubmission/deletegrievanceSubmission",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/disciplinary-action/${id}`),
                {
                    loading: "Deleting grievance Submission...",
                    success: (res) =>
                        res.data.message || "grievance Submission deleted  successfully!",
                    error: "Failed to delete grievance Submission",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || "grievance Submission deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete grievance Submission"
            );
        }
    }
);

/**
 * Fetch a single time sheet by ID.
 */
export const fetchgrievanceSubmissionById = createAsyncThunk(
    "grievanceSubmission/fetchgrievanceSubmissionById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/disciplinary-action/${id}`);
            return response.data; // Returns grievance Submission details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch grievance Submission"
            );
        }
    }
);

const grievanceSubmissionSlice = createSlice({
    name: "grievanceSubmission",
    initialState: {
        grievanceSubmission: {},
        grievanceSubmissionDetail: null,
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
            .addCase(fetchgrievanceSubmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchgrievanceSubmission.fulfilled, (state, action) => {
                state.loading = false;
                state.grievanceSubmission = action.payload.data;
            })
            .addCase(fetchgrievanceSubmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create time sheet
            .addCase(creategrievanceSubmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(creategrievanceSubmission.fulfilled, (state, action) => {
                state.loading = false;
                state.grievanceSubmission = {
                    ...state.grievanceSubmission,
                    data: [...(state.grievanceSubmission.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(creategrievanceSubmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update time sheet
            .addCase(updategrievanceSubmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updategrievanceSubmission.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.grievanceSubmission.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.grievanceSubmission.data[index] = action.payload.data;
                } else {
                    state.grievanceSubmission = {
                        ...state.grievanceSubmission,
                        data: [...(state.grievanceSubmission.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updategrievanceSubmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete time sheet
            .addCase(deletegrievanceSubmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletegrievanceSubmission.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.grievanceSubmission.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.grievanceSubmission = { ...state.grievanceSubmission, data: filterData };
                state.success = action.payload.message;
            })
            .addCase(deletegrievanceSubmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch time sheet by ID
            .addCase(fetchgrievanceSubmissionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchgrievanceSubmissionById.fulfilled, (state, action) => {
                state.loading = false;
                state.grievanceSubmissionDetail = action.payload.data; // Consider renaming to grievanceSubmissionDetail
            })
            .addCase(fetchgrievanceSubmissionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = grievanceSubmissionSlice.actions;
export default grievanceSubmissionSlice.reducer;
