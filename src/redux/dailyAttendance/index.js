
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/** daily Attendance

 * Fetch all dailyAttendance with optional filters (search, date range, pagination).
 */
export const fetchdailyAttendance = createAsyncThunk(
    "dailyAttendance/fetchdailyAttendance",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/daily-attendance", {
                params,
            });
            return response.data; // Returns list of dailyAttendance
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch dailyAttendance"
            );
        }
    }
);

/**
 * Create a new dailyAttendance.
 */
export const createdailyAttendance = createAsyncThunk(
    "dailyAttendance/createdailyAttendance",
    async (dailyAttendanceData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/daily-attendance", dailyAttendanceData),
                {
                    loading: "Creating daily Attendance...",
                    success: (res) =>
                        res.data.message || "daily Attendance created successfully!",
                    error: "Failed to create daily Attendance",
                }
            );
            return response.data; // Returns the newly created dailyAttendance
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create daily Attendance"
            );
        }
    }
);

/**
 * Update an existing dailyAttendance by ID.
 */
export const updatedailyAttendance = createAsyncThunk(
    "dailyAttendance/updatedailyAttendance",
    async ({ id, dailyAttendanceData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/daily-attendance/${id}`, dailyAttendanceData),
                {
                    loading: "Updating daily Attendance...",
                    success: (res) =>
                        res.data.message || "daily Attendance updated successfully!",
                    error: "Failed to update daily Attendance",
                }
            );
            return response.data; // Returns the updated dailyAttendance
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "daily Attendance not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update daily Attendance"
            );
        }
    }
);

/**
 * Delete an dailyAttendance by ID.
 */
export const deletedailyAttendance = createAsyncThunk(
    "dailyAttendance/deletedailyAttendance",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/daily-attendance/${id}`),
                {
                    loading: "Deleting daily Attendance...",
                    success: (res) =>
                        res.data.message || "dailyAttendance deleted successfully!",
                    error: "Failed to delete dailyAttendance",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || "dailyAttendance deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete dailyAttendance"
            );
        }
    }
);

/**
 * Fetch a single dailyAttendance by ID.
 */
export const fetchdailyAttendanceById = createAsyncThunk(
    "dailyAttendance/fetchdailyAttendanceById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/daily-attendance/${id}`);
            return response.data; // Returns dailyAttendance details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch daily Attendance"
            );
        }
    }
);

const dailyAttendanceSlice = createSlice({
    name: "dailyAttendance",
    initialState: {
        dailyAttendance: {},
        dailyAttendanceDetail: null,
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
            // Fetch all dailyAttendance
            .addCase(fetchdailyAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchdailyAttendance.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyAttendance = action.payload.data;
            })
            .addCase(fetchdailyAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create dailyAttendance
            .addCase(createdailyAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdailyAttendance.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyAttendance = {
                    ...state.dailyAttendance,
                    data: [...(state.dailyAttendance.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(createdailyAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update dailyAttendance
            .addCase(updatedailyAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatedailyAttendance.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.dailyAttendance.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.dailyAttendance.data[index] = action.payload.data;
                } else {
                    state.dailyAttendance = {
                        ...state.dailyAttendance,
                        data: [...(state.dailyAttendance.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updatedailyAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete dailyAttendance
            .addCase(deletedailyAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletedailyAttendance.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.dailyAttendance.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.dailyAttendance = {
                    ...state.dailyAttendance,
                    data: filterData,
                };
                state.success = action.payload.message;
            })
            .addCase(deletedailyAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch dailyAttendance by ID
            .addCase(fetchdailyAttendanceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchdailyAttendanceById.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyAttendanceDetail = action.payload.data;
            })
            .addCase(fetchdailyAttendanceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = dailyAttendanceSlice.actions;
export default dailyAttendanceSlice.reducer;
