import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// assets_type Slice

// Fetch All assets_type
export const fetchassets_type = createAsyncThunk(
    "assets_type/fetchassets_type",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/assets-type", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch review-template"
            );
        }
    }
);

// Add an assets_type
export const addassets_type = createAsyncThunk(
    "assets_type/addassets_type",
    async (assets_typeData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/assets-type",
                assets_typeData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add assets_type"
            );
        }
    }
);

// Update an assets_type
export const updateassets_type = createAsyncThunk(
    "assets_type/updateassets_type",
    async ({ id, assets_typeData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/assets-type/${id}`, assets_typeData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update assets_type"
            );
        }
    }
);

// Delete an assets_type
export const deleteassets_type = createAsyncThunk(
    "assets_type/deleteassets_type",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/assets-type/${id}`);
            return {
                data: { id },
                message: response.data.message || "assets_type deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete assets_type"
            );
        }
    }
);

const assets_typeSlice = createSlice({
    name: "assets_type",
    initialState: {
        assets_type: [],
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
            .addCase(fetchassets_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchassets_type.fulfilled, (state, action) => {
                state.loading = false;
                state.assets_type = action.payload.data;
            })
            .addCase(fetchassets_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addassets_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addassets_type.fulfilled, (state, action) => {
                state.loading = false;
                state.assets_type = { ...state.assets_type, data: [action.payload.data, ...state.assets_type.data] };
                state.success = action.payload.message;
            })
            .addCase(addassets_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateassets_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateassets_type.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.assets_type?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.assets_type.data[index] = action.payload.data;
                } else {
                    state.assets_type = { ...state.assets_type, data: [...state.assets_type, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updateassets_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteassets_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteassets_type.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.assets_type.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.assets_type = { ...state.assets_type, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deleteassets_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = assets_typeSlice.actions;
export default assets_typeSlice.reducer;


