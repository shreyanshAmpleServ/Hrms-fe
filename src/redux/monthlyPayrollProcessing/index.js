import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

/**
 * Fetch all time sheet with optional filters (search, date range, pagination).
 */
export const fetchmonthlyPayroll = createAsyncThunk(
    "monthlyPayroll/fetchmonthlyPayroll",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search: datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
                startDate: datas?.startDate?.toISOString() || "",
                endDate: datas?.endDate?.toISOString() || "",
            };
            const response = await apiClient.get("/v1/disciplinary-action", {
                params,
            });
            return response.data; // Returns list of  monthly Payroll
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  monthly Payroll"
            );
        }
    }
);

/**
 * Create a new time sheet.
 */
export const createmonthlyPayroll = createAsyncThunk(
    "monthlyPayroll/createmonthlyPayroll",
    async (monthlyPayrollData, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.post("/v1/disciplinary-action", monthlyPayrollData),
                {
                    loading: "Creating  monthly Payroll...",
                    success: (res) =>
                        res.data.message || " monthly Payroll created successfully!",
                    error: "Failed to create  monthly Payroll",
                }
            );
            return response.data; // Returns the newly created  monthly Payroll
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to create  monthly Payroll"
            );
        }
    }
);

/**
 * Update an existing time sheet by ID.
 */
export const updatemonthlyPayroll = createAsyncThunk(
    "monthlyPayroll/updatemonthlyPayroll",
    async ({ id, monthlyPayrollData }, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.put(`/v1/disciplinary-action/${id}`, monthlyPayrollData),
                {
                    loading: "Updating  monthly Payroll...",
                    success: (res) =>
                        res.data.message || " monthly Payroll updated successfully!",
                    error: "Failed to update  monthly Payroll",
                }
            );
            return response.data; // Returns the updated  monthly Payroll
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: " monthly Payroll not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update  monthly Payroll"
            );
        }
    }
);

/**
 * Delete an time sheet by ID.
 */
export const deletemonthlyPayroll = createAsyncThunk(
    "monthlyPayroll/deletemonthlyPayroll",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(
                apiClient.delete(`/v1/disciplinary-action/${id}`),
                {
                    loading: "Deleting  monthly Payroll...",
                    success: (res) =>
                        res.data.message || " monthly Payroll deleted  successfully!",
                    error: "Failed to delete  monthly Payroll",
                }
            );
            return {
                data: { id },
                message:
                    response.data.message || " monthly Payroll deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete  monthly Payroll"
            );
        }
    }
);

/**
 * Fetch a single time sheet by ID.
 */
export const fetchmonthlyPayrollById = createAsyncThunk(
    "monthlyPayroll/fetchmonthlyPayrollById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/disciplinary-action/${id}`);
            return response.data; // Returns  monthly Payroll details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  monthly Payroll"
            );
        }
    }
);

const monthlyPayrollSlice = createSlice({
    name: "monthlyPayroll",
    initialState: {
        monthlyPayroll: {},
        monthlyPayrollDetail: null,
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
            .addCase(fetchmonthlyPayroll.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchmonthlyPayroll.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyPayroll = action.payload.data;
            })
            .addCase(fetchmonthlyPayroll.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create time sheet
            .addCase(createmonthlyPayroll.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createmonthlyPayroll.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyPayroll = {
                    ...state.monthlyPayroll,
                    data: [...(state.monthlyPayroll.data || []), action.payload.data],
                };
                state.success = action.payload.message;
            })
            .addCase(createmonthlyPayroll.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update time sheet
            .addCase(updatemonthlyPayroll.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatemonthlyPayroll.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.monthlyPayroll.data?.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.monthlyPayroll.data[index] = action.payload.data;
                } else {
                    state.monthlyPayroll = {
                        ...state.monthlyPayroll,
                        data: [...(state.monthlyPayroll.data || []), action.payload.data],
                    };
                }
                state.success = action.payload.message;
            })
            .addCase(updatemonthlyPayroll.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete time sheet
            .addCase(deletemonthlyPayroll.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletemonthlyPayroll.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.monthlyPayroll.data?.filter(
                    (item) => item.id !== action.payload.data.id
                );
                state.monthlyPayroll = { ...state.monthlyPayroll, data: filterData };
                state.success = action.payload.message;
            })
            .addCase(deletemonthlyPayroll.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch time sheet by ID
            .addCase(fetchmonthlyPayrollById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchmonthlyPayrollById.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyPayrollDetail = action.payload.data; // Consider renaming to monthlyPayrollDetail
            })
            .addCase(fetchmonthlyPayrollById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = monthlyPayrollSlice.actions;
export default monthlyPayrollSlice.reducer;
