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

      if (res.data && res.data.data && Array.isArray(res.data.data.data)) {
        return res.data.data.data;
      }

      return [];
    } catch (err) {
      console.error("fetchUsers error:", err);

      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Failed to fetch users",
        status: err.response?.status,
        data: err.response?.data,
      });
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

      if (res.data && res.data.data) {
        return res.data.data;
      }

      return null;
    } catch (err) {
      console.error("fetchUserById error:", err);

      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Failed to fetch user",
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser", 
  async (user, { rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post("/admin/users/add", user,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Failed to add user",
        status: err.response?.status,
        data: err.response?.data
      });
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, user }, { rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await API.put(`/admin/users/${id}`, user,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Failed to update user",
        status: err.response?.status,
        data: err.response?.data
      });
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser", 
  async (id, { rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/admin/users/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || "Failed to delete user",
        status: err.response?.status,
        data: err.response?.data
      });
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
    }
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
        state.error = action.payload?.message || action.error.message;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.userLoading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload?.message || action.error.message;
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
        state.error = action.payload?.message || action.error.message;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
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
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearError, clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;