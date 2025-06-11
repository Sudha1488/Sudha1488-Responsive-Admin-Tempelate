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

export const fetchCountries = createAsyncThunk(
  "helper/fetchCountries",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/helper/get-countries", {
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
        err.response?.data?.message || err.message || "Failed to fetch countries"
      );
    }
  }
);

export const fetchStates = createAsyncThunk(
  "helper/fetchStates",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/helper/get-states", {
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
        err.response?.data?.message || err.message || "Failed to fetch states"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "helper/fetchCategories",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/helper/get-categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data.map(category => ({id: category.id, name:category.name}));
      }
      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch categories"
      );
    }
  }
);

export const fetchCities = createAsyncThunk(
  "helper/fetchCities",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/helper/get-cities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data.map(city => ({id: city.id, name:city.name}));
      }
      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch cities"
      );
    }
  }
);

const initialState = {
  rolesList: [],
  countriesList:[],
  statesList:[],
  categoriesList:[],
  citiesList:[],
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
    //for roles
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
      })
    //for countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state,action) => {
        state.loading = false;
        state.countriesList = action.payload;
        state.error = null;
      })
      .addCase(fetchCountries.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
    //for states
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state,action) => {
        state.loading = false;
        state.statesList = action.payload;
        state.error = null;
      })
      .addCase(fetchStates.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
    //for categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state,action) => {
        state.loading = false;
        state.categoriesList = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
    //for cities
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state,action) => {
        state.loading = false;
        state.citiesList = action.payload;
        state.error = null;
      })
      .addCase(fetchCities.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

  },
});

export const { clearError } = helperSlice.actions;
export default helperSlice.reducer;