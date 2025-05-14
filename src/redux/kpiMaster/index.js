import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// kpi



// Fetch All kpi
export const fetchkpi = createAsyncThunk(
    "kpi/fetchkpi",
    async (_, thunkAPI) => {
        try {
            const response = await apiClient.get("/v1/kpi");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch kpi"
            );
        }
    }
);

// Add an kpi


export const addkpi = createAsyncThunk(
    "kpi/addkpi",
    async (kpiData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/kpi", kpiData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add kpi"
            );
        }
    }
);

// Update an kpi
export const updatekpi = createAsyncThunk(
    "kpi/updatekpi",
    async ({ id, kpiData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/kpi/${id}`, kpiData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update kpi"
            );
        }
    }
);

// Delete an kpi
export const deletekpi = createAsyncThunk(
    "kpi/deletekpi",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/kpi/${id}`);
            return {
                data: { id },
                message: response.data.message || "kpi deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete kpi"
            );
        }
    }
);

const kpiSlice = createSlice({
    name: "kpi",
    initialState: {
        kpi: {},
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
            .addCase(fetchkpi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchkpi.fulfilled, (state, action) => {
                state.loading = false;
                state.kpi = action.payload.data;
            })
            .addCase(fetchkpi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addkpi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addkpi.fulfilled, (state, action) => {
                state.loading = false;
                state.kpi = { ...state.kpi, data: [action.payload.data, ...state.kpi.data] };
                state.success = action.payload.message;
            })
            .addCase(addkpi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updatekpi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatekpi.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.kpi?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.kpi.data[index] = action.payload.data;
                } else {
                    state.kpi = { ...state.kpi, data: [action.payload.data, ...state.kpi.data] };

                }
                state.success = action.payload.message;
            })
            .addCase(updatekpi

                .rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload.message;
                })
            .addCase(deletekpi

                .pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
            .addCase(deletekpi

                .fulfilled, (state, action) => {
                    state.loading = false;
                    const filteredData = state.kpi.filter(
                        (kpi) => kpi.id !== action.payload.data.id
                    );
                    state.kpi = { ...state.kpi, data: filteredData }

                    state.success = action.payload.message;
                }

            )
            .addCase(deletekpi

                .rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload.message;
                });
    },
});

export const { clearMessages } = kpiSlice.actions;
export default kpiSlice.reducer;


