import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/** Notifications
 * Fetch all Notifications with optional filters (search, date range, pagination).
 */
export const fetchNotifications = createAsyncThunk(
    "Notifications/fetchNotifications",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/notification-log", {
                params,
            });
            return response.data; // Returns list of Notifications
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch Notifications"
            );
        }
    }
);

/**
 * Create a new Notifications.
 */
export const createNotifications = createAsyncThunk(
    "Notifications/createNotifications",
    async (NotificationsData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/notification-log", NotificationsData),
                {
                    loading: "Creating Notifications...",
                    success: (res) =>
                        res.data.message || "Notifications created successfully!",
                    error: "Failed to create Notifications",
                }
            );
            return response.data; // Returns the newly created Notifications
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create Notifications"
            );
        }
    }
);

/**
 * Update an existing Notifications by ID.
 */
export const updateNotifications = createAsyncThunk(
    "Notifications/updateNotifications",
    async ({ id, NotificationsData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/notification-log/${id}`, NotificationsData),
                {
                    loading: "Updating Notifications...",
                    success: (res) =>
                        res.data.message || "Notifications updated successfully!",
                    error: "Failed to update Notifications",
                }
            );
            return response.data; // Returns the updated Notifications
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Notifications not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update Notifications"
            );
        }
    }
);

/**
 * Delete an Notifications by ID.
 */
export const deleteNotifications = createAsyncThunk(
    "Notifications/deleteNotifications",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/notification-log/${id}`),
                {
                    loading: "Deleting Notifications...",
                    success: (res) =>
                        res.data.message || "Notifications deleted successfully!",
                    error: "Failed to delete Notifications",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || "Notifications deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete Notifications"
            );
        }
    }
);

/**
 * Fetch a single Notifications by ID.
 */
export const fetchNotificationsById = createAsyncThunk(
    "Notifications/fetchNotificationsById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/notification-log/${id}`);
            return response.data; // Returns Notifications details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch Notifications"
            );
        }
    }
);

const NotificationsSlice = createSlice({
    name: "Notifications",
    initialState: {
        Notifications: {},
        NotificationsDetail: null,
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
            // Fetch all Notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.Notifications = action.payload.data;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create Notifications
            .addCase(createNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.Notifications = {
                    ...state.Notifications,
                    data: [...(state.Notifications.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(createNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update Notifications
            .addCase(updateNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNotifications.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.Notifications.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.Notifications.data[index] = action.payload.data;
                } else {
                    state.Notifications = {
                        ...state.Notifications,
                        data: [...(state.Notifications.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updateNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete Notifications
            .addCase(deleteNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNotifications.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.Notifications.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.Notifications = {
                    ...state.Notifications,
                    data: filterData,
                };
                state.success = action.payload.message;
            })
            .addCase(deleteNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch Notifications by ID
            .addCase(fetchNotificationsById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotificationsById.fulfilled, (state, action) => {
                state.loading = false;
                state.NotificationsDetail = action.payload.data;
            })
            .addCase(fetchNotificationsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = NotificationsSlice.actions;
export default NotificationsSlice.reducer;
