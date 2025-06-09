import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api";

export const fetchCities = createAsyncThunk(
  "cities/fetchCities",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/city/list", {
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
        err.response?.data?.message || err.message || "Failed to fetch cities"
      );
    }
  }
);

export const fetchCityById = createAsyncThunk(
  "cities/fetchCityById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get(`/admin/city/by-id/${id}`, {
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
        err.response?.data?.message || err.message || "Failed to fetch city"
      );
    }
  }
);

export const addCity = createAsyncThunk(
  "cities/addCity",
  async (cityData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post("/admin/city/add", cityData, {
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
        "Failed to add city";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCity = createAsyncThunk(
  "cities/updateCity",
  async ({ id, cityFormData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.put(
        `/admin/city/update/${id}`,
        cityFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update city";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCity = createAsyncThunk(
  "cities/deleteCity",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/admin/city/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete city"
      );
    }
  }
);

export const updateCityStatus = createAsyncThunk(
  "cities/updateCityStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.patch(
        `/admin/city/status/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.data && response.data.data.length > 0) {
        const updatedCityFromResponse = response.data.data[0];
        return { id: updatedCityFromResponse.id, status: updatedCityFromResponse.status };
      }
      return rejectWithValue(
        "Failed to update city status: Unexpected response structure or empty data array."
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update city status.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  cities: [],
  selectedCity: null,
  loading: false,
  cityLoading: false,
  error: null,
};

const citySlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCity: (state) => {
      state.selectedCity = null;
      state.cityLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
        state.error = null;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchCityById.pending, (state) => {
        state.cityLoading = true;
        state.selectedCity = null;
        state.error = null;
      })
      .addCase(fetchCityById.fulfilled, (state, action) => {
        state.cityLoading = false;
        state.selectedCity = action.payload;
        state.error = null;
      })
      .addCase(fetchCityById.rejected, (state, action) => {
        state.cityLoading = false;
        state.selectedCity = null;
        state.error = action.payload || action.error.message;
      })

      .addCase(addCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities.push(action.payload);
        state.error = null;
      })
      .addCase(addCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCity = action.payload;
        const index = state.cities.findIndex(
          (city) => city.id === updatedCity.id
        );
        if (index !== -1) {
          state.cities[index] = updatedCity;
        }
        state.selectedCity = updatedCity;
        state.error = null;
      })
      .addCase(updateCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = state.cities.filter((city) => city.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateCityStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCityStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        state.cities = state.cities.map((city) =>
          city.id === id ? { ...city, status: status } : city
        );
        if (state.selectedCity && state.selectedCity.id === id) {
          state.selectedCity = { ...state.selectedCity, status: status };
        }
        state.error = null;
      })
      .addCase(updateCityStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedCity } = citySlice.actions;
export default citySlice.reducer;