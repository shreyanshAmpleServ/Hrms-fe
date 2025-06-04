import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/** goalSheet
 * Fetch all goalSheet with optional filters (search, date range, pagination).
 */
export const fetchgoalSheet = createAsyncThunk(
    "goalSheet/fetchgoalSheet",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/goal-sheet", {
                params,
            });
            return response.data; // Returns list of goalSheet
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch goalSheet"
            );
        }
    }
);

/**
 * Create a new goalSheet.
 */
export const creategoalSheet = createAsyncThunk(
    "goalSheet/creategoalSheet",
    async (goalSheetData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/goal-sheet", goalSheetData),
                {
                    loading: "Creating goalSheet...",
                    success: (res) =>
                        res.data.message || "goalSheet created successfully!",
                    error: "Failed to create goalSheet",
                }
            );
            return response.data; // Returns the newly created goalSheet
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create goalSheet"
            );
        }
    }
);

/**
 * Update an existing goalSheet by ID.
 */
export const updategoalSheet = createAsyncThunk(
    "goalSheet/updategoalSheet",
    async ({ id, goalSheetData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/goal-sheet/${id}`, goalSheetData),
                {
                    loading: "Updating goalSheet...",
                    success: (res) =>
                        res.data.message || "goalSheet updated successfully!",
                    error: "Failed to update goalSheet",
                }
            );
            return response.data; // Returns the updated goalSheet
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "goalSheet not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update goalSheet"
            );
        }
    }
);

/**
 * Delete an goalSheet by ID.
 */
export const deletegoalSheet = createAsyncThunk(
    "goalSheet/deletegoalSheet",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/goal-sheet/${id}`),
                {
                    loading: "Deleting goalSheet...",
                    success: (res) =>
                        res.data.message || "goalSheet deleted successfully!",
                    error: "Failed to delete goalSheet",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || "goalSheet deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete goalSheet"
            );
        }
    }
);

/**
 * Fetch a single goalSheet by ID.
 */
export const fetchgoalSheetById = createAsyncThunk(
    "goalSheet/fetchgoalSheetById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/goal-sheet/${id}`);
            return response.data; // Returns goalSheet details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch goalSheet"
            );
        }
    }
);

const goalSheetSlice = createSlice({
    name: "goalSheet",
    initialState: {
        goalSheet: {},
        goalSheetDetail: null,
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
            // Fetch all goalSheet
            .addCase(fetchgoalSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchgoalSheet.fulfilled, (state, action) => {
                state.loading = false;
                state.goalSheet = action.payload.data;
            })
            .addCase(fetchgoalSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create goalSheet
            .addCase(creategoalSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(creategoalSheet.fulfilled, (state, action) => {
                state.loading = false;
                state.goalSheet = {
                    ...state.goalSheet,
                    data: [...(state.goalSheet.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(creategoalSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update goalSheet
            .addCase(updategoalSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updategoalSheet.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.goalSheet.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.goalSheet.data[index] = action.payload.data;
                } else {
                    state.goalSheet = {
                        ...state.goalSheet,
                        data: [...(state.goalSheet.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updategoalSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete goalSheet
            .addCase(deletegoalSheet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletegoalSheet.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.goalSheet.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.goalSheet = {
                    ...state.goalSheet,
                    data: filterData,
                };
                state.success = action.payload.message;
            })
            .addCase(deletegoalSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch goalSheet by ID
            .addCase(fetchgoalSheetById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchgoalSheetById.fulfilled, (state, action) => {
                state.loading = false;
                state.goalSheetDetail = action.payload.data;
            })
            .addCase(fetchgoalSheetById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = goalSheetSlice.actions;
export default goalSheetSlice.reducer;
