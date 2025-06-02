import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";
/** travelReimbursement travelReimbursement

 * Fetch all time sheet with optional filters (search, date range, pagination).
 */
export const fetchtravelReimbursement = createAsyncThunk(
    "travelReimbursement/fetchtravelReimbursement",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/travel-expense", {
                params,
            });
            return response.data; // Returns list of Travel Reimbursement
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch Travel Reimbursement"
            );
        }
    }
);

/**
 * Create a new time sheet.
 */
export const createtravelReimbursement = createAsyncThunk(
    "travelReimbursement/createtravelReimbursement",
    async (travelReimbursementData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/travel-expense", travelReimbursementData),
                {
                    loading: "Creating Travel Reimbursement...",
                    success: (res) =>
                        res.data.message || "Travel Reimbursement created successfully!",
                    error: "Failed to create Travel Reimbursement",
                }

            );
            return response.data; // Returns the newly created Travel Reimbursement
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create Travel Reimbursement"
            );
        }
    }
);

/**
 * Update an existing time sheet by ID.
 */
export const updatetravelReimbursement = createAsyncThunk(
    "travelReimbursement/updatetravelReimbursement",
    async ({ id, travelReimbursementData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/travel-expense/${id}`, travelReimbursementData),
                {
                    loading: "Updating Travel Reimbursement...",
                    success: (res) =>
                        res.data.message || "Travel Reimbursement updated successfully!",
                    error: "Failed to update Travel Reimbursement",
                }
            );
            return response.data; // Returns the updated Travel Reimbursement
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Travel Reimbursement not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update Travel Reimbursement"
            );
        }
    }
);

/**
 * Delete an time sheet by ID.
 */
export const deletetravelReimbursement = createAsyncThunk(
    "travelReimbursement/deletetravelReimbursement",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/travel-expense/${id}`),
                {
                    loading: "Deleting Travel Reimbursement...",
                    success: (res) =>
                        res.data.message || "Travel Reimbursement deleted  successfully!",
                    error: "Failed to delete Travel Reimbursement",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || "Travel Reimbursement deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete Travel Reimbursement"
            );
        }
    }
);

/**
 * Fetch a single time sheet by ID.
 */
export const fetchtravelReimbursementById = createAsyncThunk(
    "travelReimbursement/fetchtravelReimbursementById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/travel-expense/${id}`);
            return response.data; // Returns Travel Reimbursement details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch Travel Reimbursement"
            );
        }
    }
);

const travelReimbursementSlice = createSlice({
    name: "travelReimbursement",
    initialState: {
        travelReimbursement: {},
        travelReimbursementDetail: null,
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
            .addCase(fetchtravelReimbursement.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchtravelReimbursement.fulfilled, (state, action) => {
                state.loading = false;
                state.travelReimbursement = action.payload.data;
            })
            .addCase(fetchtravelReimbursement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create time sheet
            .addCase(createtravelReimbursement.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createtravelReimbursement.fulfilled, (state, action) => {
                state.loading = false;
                state.travelReimbursement = {
                    ...state.travelReimbursement,
                    data: [...(state.travelReimbursement.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(createtravelReimbursement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update time sheet
            .addCase(updatetravelReimbursement.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatetravelReimbursement.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.travelReimbursement.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.travelReimbursement.data[index] = action.payload.data;
                } else {
                    state.travelReimbursement = {
                        ...state.travelReimbursement,
                        data: [...(state.travelReimbursement.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updatetravelReimbursement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete time sheet
            .addCase(deletetravelReimbursement.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletetravelReimbursement.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.travelReimbursement.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.travelReimbursement = { ...state.travelReimbursement, data: filterData };
                state.success = action.payload.message;
            })
            .addCase(deletetravelReimbursement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch time sheet by ID
            .addCase(fetchtravelReimbursementById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchtravelReimbursementById.fulfilled, (state, action) => {
                state.loading = false;
                state.travelReimbursementDetail = action.payload.data; // Consider renaming to travelReimbursementDetail
            })
            .addCase(fetchtravelReimbursementById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = travelReimbursementSlice.actions;
export default travelReimbursementSlice.reducer;
