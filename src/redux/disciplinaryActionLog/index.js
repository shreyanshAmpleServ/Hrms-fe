import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all time sheet with optional filters (search, date range, pagination).
 */
export const fetchdisciplinryAction = createAsyncThunk(
    "disciplinryAction/fetchdisciplinryAction",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/diciplinary-action", {
                params,
            });
            return response.data; // Returns list of disciplinary action
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch disciplinary action"
            );
        }
    }
);

/**
 * Create a new time sheet.
 */
export const createdisciplinryAction = createAsyncThunk(
    "disciplinryAction/createdisciplinryAction",
    async (disciplinryActionData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/diciplinary-action", disciplinryActionData),
                {
                    loading: "Creating disciplinary action...",
                    success: (res) =>
                        res.data.message || "disciplinary action created successfully!",
                    error: "Failed to create disciplinary action",
                }
            );
            return response.data; // Returns the newly created disciplinary action
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create disciplinary action"
            );
        }
    }
);

/**
 * Update an existing time sheet by ID.
 */
export const updatedisciplinryAction = createAsyncThunk(
    "disciplinryAction/updatedisciplinryAction",
    async ({ id, disciplinryActionData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/diciplinary-action/${id}`, disciplinryActionData),
                {
                    loading: "Updating disciplinary action...",
                    success: (res) =>
                        res.data.message || "disciplinary action updated successfully!",
                    error: "Failed to update disciplinary action",
                }
            );
            return response.data; // Returns the updated disciplinary action
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "disciplinary action not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update disciplinary action"
            );
        }
    }
);

/**
 * Delete an time sheet by ID.
 */
export const deletedisciplinryAction = createAsyncThunk(
    "disciplinryAction/deletedisciplinryAction",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/diciplinary-action/${id}`),
                {
                    loading: "Deleting disciplinary action...",
                    success: (res) =>
                        res.data.message || "disciplinary action deleted  successfully!",
                    error: "Failed to delete disciplinary action",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || "disciplinary action deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete disciplinary action"
            );
        }
    }
);

/**
 * Fetch a single time sheet by ID.
 */
export const fetchdisciplinryActionById = createAsyncThunk(
    "disciplinryAction/fetchdisciplinryActionById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/diciplinary-action/${id}`);
            return response.data; // Returns disciplinary action details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch disciplinary action"
            );
        }
    }
);

const disciplinryActionSlice = createSlice({
    name: "disciplinryAction",
    initialState: {
        disciplinryAction: {},
        disciplinryActionDetail: null,
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
            .addCase(fetchdisciplinryAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchdisciplinryAction.fulfilled, (state, action) => {
                state.loading = false;
                state.disciplinryAction = action.payload.data;
            })
            .addCase(fetchdisciplinryAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create time sheet
            .addCase(createdisciplinryAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdisciplinryAction.fulfilled, (state, action) => {
                state.loading = false;
                state.disciplinryAction = {
                    ...state.disciplinryAction,
                    data: [...(state.disciplinryAction.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(createdisciplinryAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update time sheet
            .addCase(updatedisciplinryAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatedisciplinryAction.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.disciplinryAction.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.disciplinryAction.data[index] = action.payload.data;
                } else {
                    state.disciplinryAction = {
                        ...state.disciplinryAction,
                        data: [...(state.disciplinryAction.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updatedisciplinryAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete time sheet
            .addCase(deletedisciplinryAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletedisciplinryAction.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.disciplinryAction.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.disciplinryAction = { ...state.disciplinryAction, data: filterData };
                state.success = action.payload.message;
            })
            .addCase(deletedisciplinryAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch time sheet by ID
            .addCase(fetchdisciplinryActionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchdisciplinryActionById.fulfilled, (state, action) => {
                state.loading = false;
                state.disciplinryActionDetail = action.payload.data; // Consider renaming to disciplinryActionDetail
            })
            .addCase(fetchdisciplinryActionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = disciplinryActionSlice.actions;
export default disciplinryActionSlice.reducer;
