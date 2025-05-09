import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// employee_type Slice

// Fetch All employee_types
export const fetchemployee_type = createAsyncThunk(
    "employee_type/fetchemployee_type",
    async (datas, thunkAPI) => {
        try {
            const params = {}
            if (datas?.search) params.search = datas?.search
            if (datas?.page) params.page = datas?.page
            if (datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/employee-type", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch employee_types"
            );
        }
    }
);

// Add an employee_type
export const addemployee_type = createAsyncThunk(
    "employee_type/addemployee_type",
    async (employee_typeData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/employee-type", employee_typeData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add employee_type"
            );
        }
    }
);

// Update an employee_type
export const updateemployee_type = createAsyncThunk(
    "employee_type/updateemployee_type",
    async ({ id, employee_typeData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/employee-type/${id}`, employee_typeData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update employee_type"
            );
        }
    }
);

// Delete an employee_type
export const deleteemployee_type = createAsyncThunk(
    "employee_type/deleteemployee_type",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/employee-type/${id}`);
            return {
                data: { id },
                message: response.data.message || "employee_type deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete employee_type"
            );
        }
    }
);

const employee_typesSlice = createSlice({
    name: "employee_type",
    initialState: {
        employee_type: [],
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
            .addCase(fetchemployee_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchemployee_type.fulfilled, (state, action) => {
                state.loading = false;
                state.employee_type = action.payload.data;
            })
            .addCase(fetchemployee_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addemployee_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addemployee_type.fulfilled, (state, action) => {
                state.loading = false;
                state.employee_type = { ...state.employee_type, data: [action.payload.data, ...state.employee_type.data] };
                state.success = action.payload.message;
            })
            .addCase(addemployee_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateemployee_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateemployee_type.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.employee_type?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.employee_type.data[index] = action.payload.data;
                } else {
                    state.employee_type = { ...state.employee_type, data: [...state.employee_type, action.payload.data] };
                }
                state.success = action.payload.message;
            })
            .addCase(updateemployee_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteemployee_type.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteemployee_type.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.employee_type.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.employee_type = { ...state.employee_type, data: filterData }
                state.success = action.payload.message;
            })
            .addCase(deleteemployee_type.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = employee_typesSlice.actions;
export default employee_typesSlice.reducer;


