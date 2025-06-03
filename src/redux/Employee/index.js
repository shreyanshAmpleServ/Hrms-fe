import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All employee
export const fetchEmployee = createAsyncThunk(
  "employee/fetchEmployee",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search: datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate: datas?.endDate?.toISOString() || "",
      };
      const response = await apiClient.get("/v1/employee", { params });
      return response.data; // Returns a list of employee
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employee"
      );
    }
  }
);

// Add a employee
export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (employeeData, thunkAPI) => {
    try {
      // const response = await apiClient.post("/v1/employee", employeeData);
      const response = await toast.promise(
        apiClient.post("/v1/employee", employeeData),
        {
          loading: "Employee adding...",
          success: (res) => res.data.message || "Employee added successfully!",
          error: "Failed to add employee",
        }
      );
      return response.data; // Returns the newly added employee
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add employee"
      );
    }
  }
);

// Update a employee
export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async (employeeData, thunkAPI) => {
    const id = employeeData?.get("id");
    try {
      // const response = await apiClient.put(`/v1/employee/${id}`, employeeData);
      const response = await toast.promise(
        apiClient.put(`/v1/employee/${id}`, employeeData),
        {
          loading: "Employee updating...",
          success: (res) =>
            res?.data?.message || "Employee updated successfully!",
          error: "Failed to update employee",
        }
      );
      return response.data; // Returns the updated employee
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update employee"
      );
    }
  }
);

// Delete a employee
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/employee/${id}`);
      return {
        data: { id },
        message: response.data.message || "Employee deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete employee"
      );
    }
  }
);

// Fetch a Single employee by ID
export const fetchEmployeeById = createAsyncThunk(
  "employee/fetchEmployeeById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/employee/${id}`);
      return response.data; // Returns the employee details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employee"
      );
    }
  }
);

export const updateEmployeeExperience = createAsyncThunk(
  "employee/updateEmployeeExperience",
  async ({ id, experiences }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/employee-experience/${id}`, {
          experiences: experiences,
        }),
        {
          loading: "Employee experience updating...",
          success: (res) =>
            res?.data?.message || "Employee experience updated successfully!",
          error: "Failed to update employee experience",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update employee experience"
      );
    }
  }
);

export const updateEmployeeEducation = createAsyncThunk(
  "employee/updateEmployeeEducation",
  async ({ id, educations }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/employee-education/${id}`, {
          educations,
        }),
        {
          loading: "Employee education updating...",
          success: (res) =>
            res?.data?.message || "Employee education updated successfully!",
          error: "Failed to update employee education",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update employee education"
      );
    }
  }
);

const employeesSlice = createSlice({
  name: "employee",
  initialState: {
    employee: {},
    employeeDetail: null,
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
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload.data;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = {
          ...state.employee,
          data: [...state.employee.data, action.payload.data],
        };
        state.success = action.payload.message;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.employee.data) {
          state.employee = {
            ...state.employee,
            data: [action.payload.data],
          };
        } else {
          const index = state.employee.data.findIndex(
            (data) => data.id === action.payload.data.id
          );

          if (index !== -1 && action.payload.data) {
            state.employee.data[index] = action.payload.data;
            state.employeeDetail = action.payload.data;
          } else if (action.payload.data) {
            state.employeeDetail = action.payload.data;
            state.employee = {
              ...state.employee,
              data: [...state.employee.data, action.payload.data],
            };
          }
        }

        state.success = action.payload.message;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.employee.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.employee = { ...state.employee, data: filterData };
        state.success = action.payload.message;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeDetail = action.payload.data;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateEmployeeExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.employeeDetail = action.payload.data;
      })
      .addCase(updateEmployeeExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateEmployeeEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.employeeDetail = action.payload.data;
      })
      .addCase(updateEmployeeEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = employeesSlice.actions;
export default employeesSlice.reducer;
