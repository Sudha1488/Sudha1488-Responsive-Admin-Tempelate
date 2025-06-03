import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/users/list", {
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
        err.response?.data?.message || err.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get(`/admin/users/by-id/${id}`, {
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
        err.response?.data?.message || err.message || "Failed to fetch user"
      );
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post("/admin/users/add", userData, {
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
        "Failed to add user";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userFormData }, { rejectWithValue, getState }) => { 
    try {
      const token = getState().auth.token;

      const response = await API.put(`/admin/users/update/${id}`, userFormData, { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data?.error || err.message || "Failed to update user";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/admin/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete user"
      );
    }
  }
);

// usersSlice.js

export const updateStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.patch(`/admin/users/status/${id}`, { status: status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) { 
        return { id: response.data.data.id, status: response.data.data.status }; 
      }
      return rejectWithValue("Failed to update user status: Unexpected response structure.");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update user status.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  userLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.userLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.userLoading = true;
        state.selectedUser = null;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.userLoading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.userLoading = false;
        state.selectedUser = null;
        state.error = action.payload || action.error.message;
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        state.error = null;
        state.selectedUser = updatedUser;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
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
        const index = state.users.findIndex((user) => user.id === id);
        if (index !== -1) {
          state.users[index].status = status;
        }
        state.error = null;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;