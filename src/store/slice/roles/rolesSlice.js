import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api";

export const fetchRoles = createAsyncThunk(
  "users/fetchRoles",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/roles/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        return res.data.data.data;
      }
      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch roles"
      );
    }
  }
);

export const fetchRoleById = createAsyncThunk(
  "roles/fetchRoleById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get(`/admin/roles/by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.data) {
        const roleData = res.data.data;
        if (roleData.permissions && Array.isArray(roleData.permissions)) {
          roleData.permissions = roleData.permissions.map(p => p.name);
        }
        return roleData;
      }
      return null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch role"
      );
    }
  }
);

export const fetchRolePermissions = createAsyncThunk("roles/fetchRolePermissions",async(id, {rejectWithValue, getState})=>{
  try {
    const token =getState().auth.token;
    const res = await API.get(`/admin/roles/get-permissions`,{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });

    if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        return res.data.data.data;
    }
    return null;
  } catch (error) {
    return rejectWithValue(
      err.response?.data?.message || err.message || "Failed to fetch role's permissions"
    );
  }
});

export const addRole = createAsyncThunk(
  "roles/addRole",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post("/admin/roles/add", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to add roler";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ id, userFormData }, { rejectWithValue, getState }) => {
    console.log("Form Data before updating", userFormData)
    try {
      const token = getState().auth.token;

      const response = await API.put(
        `/admin/roles/update/${id}`,
        userFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update role";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "users/deleteRole",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/admin/roles/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete role"
      );
    }
  }
);

export const updateStatus = createAsyncThunk(
  "roles/updateRoleStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.patch(
        `/admin/roles/status/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data && response.data.data.length > 0) {
        const updatedRoleFromResponse = response.data.data[0];
        return { id: updatedRoleFromResponse.id, status: updatedRoleFromResponse.status };
      }
      return rejectWithValue(
        "Failed to update role status: Unexpected response structure or empty data array."
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update role status.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  roles: [],
  selectedRole: null,
  permissionsList: [],
  loading: false,
  roleLoading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
      state.roleLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchRoleById.pending, (state) => {
        state.roleLoading = true;
        state.selectedRole = null;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.roleLoading = false;
        state.selectedRole = action.payload;
        state.error = null;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.roleLoading = false;
        state.selectedRole = null;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchRolePermissions.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.permissionsList = action.payload;
        state.error = null;
      })
      .addCase(fetchRolePermissions.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(addRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
        state.error = null;
      })
      .addCase(addRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRole = action.payload;
        const index = state.roles.findIndex(
          (role) => role.id === updatedRole.id
        );
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        state.error = null;
        state.selectedRole = updatedRole;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((role) => role.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;  
        state.roles = state.roles.map((role) =>
          role.id === id ? { ...role, status: status } : role
        );
        if (state.selectedRole && state.selectedRole.id === id) {
          state.selectedRole = { ...state.selectedRole, status: status };
        }
        state.error = null;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedRole } = rolesSlice.actions;
export default rolesSlice.reducer;
