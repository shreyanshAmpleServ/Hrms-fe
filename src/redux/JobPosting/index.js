import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// job_posting Slice

// Fetch All job_posting
export const fetchjob_posting = createAsyncThunk(
    "job_posting/fetchjob_posting",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/job-posting", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch review-template"
            );
        }
    }
);

// Add an job_posting
export const addjob_posting = createAsyncThunk(
    "job_posting/addjob_posting",
    async (job_postingData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/job-posting",
                job_postingData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add job_posting"
            );
        }
    }
);

// Update an job_posting
export const updatejob_posting = createAsyncThunk(
    "job_posting/updatejob_posting",
    async ({ id, job_postingData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/job-posting/${id}`, job_postingData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update job_posting"
            );
        }
    }
);

// Delete an job_posting
export const deletejob_posting = createAsyncThunk(
    "job_posting/deletejob_posting",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/job-posting/${id}`);
            return {
                data: { id },
                message: response.data.message || "job_posting deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete job_posting"
            );
        }
    }
);

const job_postingSlice = createSlice({
    name: "job_posting",
    initialState: {
        job_posting: [],
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
            .addCase(fetchjob_posting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchjob_posting.fulfilled, (state, action) => {
                state.loading = false;
                state.job_posting = action.payload.data;
            })
            .addCase(fetchjob_posting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addjob_posting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addjob_posting.fulfilled, (state, action) => {
                state.loading = false;
                state.job_posting = { ...state.job_posting, data: [action.payload.data, ...state.job_posting.data] };
                state.success = action.payload.message;
            })
            .addCase(addjob_posting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updatejob_posting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatejob_posting.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.job_posting?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.job_posting.data[index] = action.payload.data;
                } else {
                    state.job_posting = { ...state.job_posting, data: [...state.job_posting, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updatejob_posting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deletejob_posting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletejob_posting.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.job_posting.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.job_posting = { ...state.job_posting, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deletejob_posting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = job_postingSlice.actions;
export default job_postingSlice.reducer;


