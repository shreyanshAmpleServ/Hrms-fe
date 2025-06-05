import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/** resume_upload
 * Fetch all resume_upload with optional filters (search, date range, pagination).
 */
export const fetchresume_upload = createAsyncThunk(
    "resume_upload/fetchresume_upload",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/resume-upload", {
                params,
            });
            return response.data; // Returns list of resume_upload
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch Resume Upload"
            );
        }
    }
);

/**
 * Create a new Resume Upload.
 */
export const addresume_upload = createAsyncThunk(
    "resume_upload/addresume_upload",
    async (resume_uploadData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/resume-upload", resume_uploadData),
                {
                    loading: "Creating Resume Upload...",
                    success: (res) =>
                        res.data.message || "Resume Upload created successfully!",
                    error: "Failed to create Resume Upload",
                }
            );
            return response.data; // Returns the newly created resume_upload
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create Resume Upload"
            );
        }
    }
);

/**
 * Update an existing resume_upload by ID.
 */
export const updateresume_upload = createAsyncThunk(
    "resume_upload/updateresume_upload",
    async ({ id, resume_uploadData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/resume-upload/${id}`, resume_uploadData),
                {
                    loading: "Updating resume_upload...",
                    success: (res) =>
                        res.data.message || "resume_upload updated successfully!",
                    error: "Failed to update resume_upload",
                }
            );
            return response.data; // Returns the updated resume_upload
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "resume_upload not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update resume_upload"
            );
        }
    }
);

/**
 * Delete an resume_upload by ID.
 */
export const deleteresume_upload = createAsyncThunk(
    "resume_upload/deleteresume_upload",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/resume-upload/${id}`),
                {
                    loading: "Deleting resume_upload...",
                    success: (res) =>
                        res.data.message || "resume_upload deleted successfully!",
                    error: "Failed to delete resume_upload",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || "resume_upload deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete resume_upload"
            );
        }
    }
);

/**
 * Fetch a single resume_upload by ID.
 */
export const fetchresume_uploadById = createAsyncThunk(
    "resume_upload/fetchresume_uploadById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/resume-upload/${id}`);
            return response.data; // Returns resume_upload details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch resume_upload"
            );
        }
    }
);

const resume_uploadSlice = createSlice({
    name: "resume_upload",
    initialState: {
        resume_upload: {},
        resume_uploadDetail: null,
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
            // Fetch all resume_upload
            .addCase(fetchresume_upload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchresume_upload.fulfilled, (state, action) => {
                state.loading = false;
                state.resume_upload = action.payload.data;
            })
            .addCase(fetchresume_upload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create resume_upload
            .addCase(addresume_upload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addresume_upload.fulfilled, (state, action) => {
                state.loading = false;
                state.resume_upload = {
                    ...state.resume_upload,
                    data: [...(state.resume_upload.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(addresume_upload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update resume_upload
            .addCase(updateresume_upload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateresume_upload.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.resume_upload.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.resume_upload.data[index] = action.payload.data;
                } else {
                    state.resume_upload = {
                        ...state.resume_upload,
                        data: [...(state.resume_upload.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updateresume_upload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete resume_upload
            .addCase(deleteresume_upload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteresume_upload.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.resume_upload.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.resume_upload = {
                    ...state.resume_upload,
                    data: filterData,
                };
                state.success = action.payload.message;
            })
            .addCase(deleteresume_upload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch resume_upload by ID
            .addCase(fetchresume_uploadById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchresume_uploadById.fulfilled, (state, action) => {
                state.loading = false;
                state.resume_uploadDetail = action.payload.data;
            })
            .addCase(fetchresume_uploadById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = resume_uploadSlice.actions;
export default resume_uploadSlice.reducer;
