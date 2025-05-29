import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";
/** successionPlanning
successionPlanning
 * Fetch all time sheet with optional filters (search, date range, pagination).
 */
export const fetchsuccessionPlanning = createAsyncThunk(
    "successionPlanning/fetchsuccessionPlanning",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/succession-planning", {
                params,
            });
            return response.data; // Returns list of  succession Planning 
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  succession Planning "
            );
        }
    }
);

/**
 * Create a new time sheet.
 */
export const createsuccessionPlanning = createAsyncThunk(
    "successionPlanning/createsuccessionPlanning",
    async (successionPlanningData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/succession-planning", successionPlanningData),
                {
                    loading: "Creating  succession Planning ...",
                    success: (res) =>
                        res.data.message || "succession Planning  created successfully!",
                    error: "Failed to create  succession Planning ",
                }

            );
            return response.data; // Returns the newly created  succession Planning 
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create  succession Planning "
            );
        }
    }
);

/**
 * Update an existing time sheet by ID.
 */
export const updatesuccessionPlanning = createAsyncThunk(
    "successionPlanning/updatesuccessionPlanning",
    async ({ id, successionPlanningData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/succession-planning/${id}`, successionPlanningData),
                {
                    loading: "Updating  succession Planning ...",
                    success: (res) =>
                        res.data.message || "succession Planning  updated successfully!",
                    error: "Failed to update  succession Planning ",
                }
            );
            return response.data; // Returns the updated  succession Planning 
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: " succession Planning  not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update  succession Planning "
            );
        }
    }
);

/**
 * Delete an time sheet by ID.
 */
export const deletesuccessionPlanning = createAsyncThunk(
    "successionPlanning/deletesuccessionPlanning",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/succession-planning/${id}`),
                {
                    loading: "Deleting  succession Planning ...",
                    success: (res) =>
                        res.data.message || "succession Planning  deleted  successfully!",
                    error: "Failed to delete  succession Planning ",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || "succession Planning  deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete  succession Planning "
            );
        }
    }
);

/**
 * Fetch a single time sheet by ID.
 */
export const fetchsuccessionPlanningById = createAsyncThunk(
    "successionPlanning/fetchsuccessionPlanningById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/succession-planning/${id}`);
            return response.data; // Returns  succession Planning  details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  succession Planning "
            );
        }
    }
);

const successionPlanningSlice = createSlice({
    name: "successionPlanning",
    initialState: {
        successionPlanning: {},
        successionPlanningDetail: null,
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
            .addCase(fetchsuccessionPlanning.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchsuccessionPlanning.fulfilled, (state, action) => {
                state.loading = false;
                state.successionPlanning = action.payload.data;
            })
            .addCase(fetchsuccessionPlanning.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create time sheet
            .addCase(createsuccessionPlanning.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createsuccessionPlanning.fulfilled, (state, action) => {
                state.loading = false;
                state.successionPlanning = {
                    ...state.successionPlanning,
                    data: [...(state.successionPlanning.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(createsuccessionPlanning.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update time sheet
            .addCase(updatesuccessionPlanning.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatesuccessionPlanning.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.successionPlanning.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.successionPlanning.data[index] = action.payload.data;
                } else {
                    state.successionPlanning = {
                        ...state.successionPlanning,
                        data: [...(state.successionPlanning.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updatesuccessionPlanning.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete time sheet
            .addCase(deletesuccessionPlanning.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletesuccessionPlanning.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.successionPlanning.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.successionPlanning = { ...state.successionPlanning, data: filterData };
                state.success = action.payload.message;
            })
            .addCase(deletesuccessionPlanning.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch time sheet by ID
            .addCase(fetchsuccessionPlanningById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchsuccessionPlanningById.fulfilled, (state, action) => {
                state.loading = false;
                state.successionPlanningDetail = action.payload.data; // Consider renaming to successionPlanningDetail
            })
            .addCase(fetchsuccessionPlanningById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = successionPlanningSlice.actions;
export default successionPlanningSlice.reducer;
