import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// award_type Slice

// Fetch All award_type
export const fetchaward_type = createAsyncThunk(
    "award_type/fetchaward_type",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/award-type", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch award_type"
            );
        }
    }
);

// Add an award_type
export const addaward_type = createAsyncThunk(
    "award_type/addaward_type",
    async (award_typeData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/award-type", award_typeData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add award_type"
            );
        }
    }
);

// Update an award_type
export const updateaward_type = createAsyncThunk(
    "award_type/updateaward_type",
    async ({ id, award_typeData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/award-type/${id}`, award_typeData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update award_type"
            );
        }
    }
);

// Delete an award_type
export const deleteaward_type = createAsyncThunk(
    "award_type/deleteaward_type",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/award-type/${id}`);
            return {
                data: { id },
                message: response.data.message || "award_type deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete award_type"
            );
        }
    }
);

const award_typeSlice = createSlice({
    name: "award_type",
    initialState: {
        award_type: [],
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
            .addCase(fetchaward_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchaward_type.fulfilled, (state, action) => {
                state.loading = false;
                state.award_type = action.payload.data;
            })
            .addCase(fetchaward_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addaward_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addaward_type.fulfilled, (state, action) => {
                state.loading = false;
                state.award_type = { ...state.award_type, data: [action.payload.data, ...state.award_type.data] };
                state.success = action.payload.message;
            })
            .addCase(addaward_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateaward_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateaward_type.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.award_type?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.award_type.data[index] = action.payload.data;
                } else {
                    state.award_type = { ...state.award_type, data: [...state.award_type, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updateaward_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteaward_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteaward_type.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.award_type.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.award_type = { ...state.award_type, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deleteaward_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = award_typeSlice.actions;
export default award_typeSlice.reducer;


