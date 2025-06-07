import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api";

export const fetchRoles = createAsyncThunk(
  "helper/fetchRoles",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/helper/get-roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data.map(role => ({id: role.id, name:role.name}));
      }
      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch roles"
      );
    }
  }
);

const initialState = {
  rolesList: [],
  loading: false,
  error: null,
};

const helperSlice = createSlice({
  name: "helper",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state,action) => {
        state.loading = false;
        state.rolesList = action.payload;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError } = helperSlice.actions;
export default helperSlice.reducer;
