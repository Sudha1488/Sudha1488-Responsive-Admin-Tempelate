import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api";

export const fetchPermissions = createAsyncThunk(
  "permissions/fetchPermissions",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/permissions/list", {
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
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch permissions"
      );
    }
  }
);

export const fetchPermissionsById = createAsyncThunk(
  "permissions/fetchPermissionsById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get(`/admin/permissions/by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.data) {
        return res.data.data;
      }
      return null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch permissions"
      );
    }
  }
);

export const addPermission = createAsyncThunk(
  "permissions/addPermission",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post("/admin/permissions/add", userData, {
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
        "Failed to add permissions";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatePermission = createAsyncThunk(
  "permissions/updatePermission",
  async ({ id, userFormData }, { rejectWithValue, getState }) => {
    console.log("Form Data before updating", userFormData);
    try {
      const token = getState().auth.token;

      const response = await API.put(
        `/admin/permissions/update/${id}`,
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
        "Failed to update permission";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deletePermission = createAsyncThunk(
  "permissions/deletePermission",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/admin/permissions/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete Permission"
      );
    }
  }
);

export const updateStatus = createAsyncThunk(
  "permissions/updateStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.patch(
        `/admin/permissions/status/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        const updatedRoleFromResponse = response.data.data[0];
        return {
          id: updatedRoleFromResponse.id,
          status: updatedRoleFromResponse.status,
        };
      }
      return rejectWithValue(
        "Failed to update permission status: Unexpected response structure or empty data array."
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update permission status.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  permissions: [],
  selectedPermission: null,
  loading: false,
  permissionLoading: false,
  error: null,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPermission: (state) => {
      state.selectedPermission = null;
      state.permissionLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
        state.error = null;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchPermissionsById.pending, (state) => {
        state.permissionLoading = true;
        state.selectedPermission = null;
        state.error = null;
      })
      .addCase(fetchPermissionsById.fulfilled, (state, action) => {
        state.permissionLoading = false;
        state.selectedPermission = action.payload;
        state.error = null;
      })
      .addCase(fetchPermissionsById.rejected, (state, action) => {
        state.permissionLoading = false;
        state.selectedPermission = null;
        state.error = action.payload || action.error.message;
      })
      .addCase(addPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions.push(action.payload);
        state.error = null;
      })
      .addCase(addPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updatePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updatePermission.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPermission =
          action.payload &&
          Array.isArray(action.payload) &&
          action.payload.length > 0
            ? action.payload[0]
            : null;

        if (updatedPermission) {
          const index = state.permissions.findIndex(
            (permission) => permission.id === updatedPermission.id
          );
          if (index !== -1) {
            state.permissions[index] = updatedPermission;
          }
          state.selectedPermission = updatedPermission;
        } else {
          console.warn(
            "Update permission API returned no data or unexpected format in payload."
          );
        }
        state.error = null;
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deletePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = state.permissions.filter(
          (permission) => permission.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deletePermission.rejected, (state, action) => {
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
        state.permissions = state.permissions.map((permission) =>
          permission.id === id ? { ...permission, status: status } : permission
        );
        if (state.selectedPermission && state.selectedPermission.id === id) {
          state.selectedPermission = {
            ...state.selectedPermission,
            status: status,
          };
        }
        state.error = null;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedPermission } = permissionsSlice.actions;
export default permissionsSlice.reducer;
