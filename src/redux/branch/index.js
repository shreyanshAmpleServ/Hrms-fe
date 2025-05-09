import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// branch Slice

// Fetch All branch
export const fetchbranch = createAsyncThunk(
    "branch/fetchbranch",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/branch", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch branch"
            );
        }
    }
);

// Add an branch
export const addbranch = createAsyncThunk(
    "branch/addbranch",
    async (branchData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/branch", branchData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add branch"
            );
        }
    }
);

// Update an branch
export const updatebranch = createAsyncThunk(
    "branch/updatebranch",
    async ({ id, branchData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/branch/${id}`, branchData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update branch"
            );
        }
    }
);

// Delete an branch
export const deletebranch = createAsyncThunk(
    "branch/deletebranch",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/branch/${id}`);
            return {
                data: { id },
                message: response.data.message || "branch deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete branch"
            );
        }
    }
);

const branchSlice = createSlice({
    name: "branch",
    initialState: {
        branch: [],
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
            .addCase(fetchbranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchbranch.fulfilled, (state, action) => {
                state.loading = false;
                state.branch = action.payload.data;
            })
            .addCase(fetchbranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addbranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addbranch.fulfilled, (state, action) => {
                state.loading = false;
                state.branch = { ...state.branch, data: [action.payload.data, ...state.branch.data] };
                state.success = action.payload.message;
            })
            .addCase(addbranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updatebranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatebranch.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.branch?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.branch.data[index] = action.payload.data;
                } else {
                    state.branch = { ...state.branch, data: [...state.branch, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updatebranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deletebranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletebranch.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.branch.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.branch = { ...state.branch, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deletebranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = branchSlice.actions;
export default branchSlice.reducer;


