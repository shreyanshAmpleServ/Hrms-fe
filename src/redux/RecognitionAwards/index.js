import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";
/** recognitionAwards recognitionAwards

 * Fetch all time sheet with optional filters (search, date range, pagination).
 */
export const fetchrecognitionAwards = createAsyncThunk(
    "recognitionAwards/fetchrecognitionAwards",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/recognition-award", {
                params,
            });
            return response.data; // Returns list of recognition award
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch recognition award"
            );
        }
    }
);

/**
 * Create a new time sheet.
 */
export const createrecognitionAwards = createAsyncThunk(
    "recognitionAwards/createrecognitionAwards",
    async (recognitionAwardsData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/recognition-award", recognitionAwardsData),
                {
                    loading: "Creating recognition award...",
                    success: (res) =>
                        res.data.message || "recognition award created successfully!",
                    error: "Failed to create recognition award",
                }

            );
            return response.data; // Returns the newly created recognition award
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create recognition award"
            );
        }
    }
);

/**
 * Update an existing time sheet by ID.
 */
export const updaterecognitionAwards = createAsyncThunk(
    "recognitionAwards/updaterecognitionAwards",
    async ({ id, recognitionAwardsData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/recognition-award/${id}`, recognitionAwardsData),
                {
                    loading: "Updating recognition award...",
                    success: (res) =>
                        res.data.message || "recognition award updated successfully!",
                    error: "Failed to update recognition award",
                }
            );
            return response.data; // Returns the updated recognition award
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "recognition award not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update recognition award"
            );
        }
    }
);

/**
 * Delete an time sheet by ID.
 */
export const deleterecognitionAwards = createAsyncThunk(
    "recognitionAwards/deleterecognitionAwards",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/recognition-award/${id}`),
                {
                    loading: "Deleting recognition award...",
                    success: (res) =>
                        res.data.message || "recognition award deleted  successfully!",
                    error: "Failed to delete recognition award",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || "recognition award deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete recognition award"
            );
        }
    }
);

/**
 * Fetch a single time sheet by ID.
 */
export const fetchrecognitionAwardsById = createAsyncThunk(
    "recognitionAwards/fetchrecognitionAwardsById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/recognition-award/${id}`);
            return response.data; // Returns recognition award details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch recognition award"
            );
        }
    }
);

const recognitionAwardsSlice = createSlice({
    name: "recognitionAwards",
    initialState: {
        recognitionAwards: {},
        recognitionAwardsDetail: null,
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
            .addCase(fetchrecognitionAwards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchrecognitionAwards.fulfilled, (state, action) => {
                state.loading = false;
                state.recognitionAwards = action.payload.data;
            })
            .addCase(fetchrecognitionAwards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create time sheet
            .addCase(createrecognitionAwards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createrecognitionAwards.fulfilled, (state, action) => {
                state.loading = false;
                state.recognitionAwards = {
                    ...state.recognitionAwards,
                    data: [...(state.recognitionAwards.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(createrecognitionAwards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update time sheet
            .addCase(updaterecognitionAwards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updaterecognitionAwards.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.recognitionAwards.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                console.log("data : ", action.payload.data)
                if (index !== -1) {
                    state.recognitionAwards.data[index] = action.payload.data;
                } else {
                    state.recognitionAwards = {
                        ...state.recognitionAwards,
                        data: [...(state.recognitionAwards.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updaterecognitionAwards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete time sheet
            .addCase(deleterecognitionAwards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleterecognitionAwards.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.recognitionAwards.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.recognitionAwards = { ...state.recognitionAwards, data: filterData };
                state.success = action.payload.message;
            })
            .addCase(deleterecognitionAwards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch time sheet by ID
            .addCase(fetchrecognitionAwardsById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchrecognitionAwardsById.fulfilled, (state, action) => {
                state.loading = false;
                state.recognitionAwardsDetail = action.payload.data; // Consider renaming to recognitionAwardsDetail
            })
            .addCase(fetchrecognitionAwardsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = recognitionAwardsSlice.actions;
export default recognitionAwardsSlice.reducer;
