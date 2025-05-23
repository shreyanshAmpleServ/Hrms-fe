import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// resume_upload Slice

// Fetch All resume_upload
export const fetchresume_upload = createAsyncThunk(
    "resume_upload/fetchresume_upload",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/resume-upload", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch resume-upload"
            );
        }
    }
);

// Add an resume_upload
export const addresume_upload = createAsyncThunk(
    "resume_upload/addresume_upload",
    async (resume_uploadData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/resume-upload", resume_uploadData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add resume_upload"
            );
        }
    }
);

// Update an resume_upload
export const updateresume_upload = createAsyncThunk(
    "resume_upload/updateresume_upload",
    async ({ id, resume_uploadData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/resume-upload/${id}`, resume_uploadData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update resume_upload"
            );
        }
    }
);

// Delete an resume_upload
export const deleteresume_upload = createAsyncThunk(
    "resume_upload/deleteresume_upload",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/resume-upload/${id}`);
            return {
                data: { id },
                message: response.data.message || "resume_upload deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete resume_upload"
            );
        }
    }
);

const resume_uploadSlice = createSlice({
    name: "resume_upload",
    initialState: {
        resume_upload: [],
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
            .addCase(addresume_upload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addresume_upload.fulfilled, (state, action) => {
                state.loading = false;
                state.resume_upload = { ...state.resume_upload, data: [action.payload.data, ...state.resume_upload.data] };
                state.success = action.payload.message;
            })
            .addCase(addresume_upload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateresume_upload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateresume_upload.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.resume_upload?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.resume_upload.data[index] = action.payload.data;
                } else {
                    state.resume_upload = { ...state.resume_upload, data: [...state.resume_upload, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updateresume_upload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteresume_upload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteresume_upload.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.resume_upload.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.resume_upload = { ...state.resume_upload, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deleteresume_upload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = resume_uploadSlice.actions;
export default resume_uploadSlice.reducer;


