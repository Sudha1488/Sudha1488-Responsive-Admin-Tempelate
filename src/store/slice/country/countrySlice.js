import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api";

export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/country/list", {
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
        err.response?.data?.message || err.message || "Failed to fetch countries"
      );
    }
  }
);

export const fetchCountryById = createAsyncThunk(
  "countries/fetchCountryById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get(`/admin/country/by-id/${id}`, {
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
        err.response?.data?.message || err.message || "Failed to fetch country"
      );
    }
  }
);

export const addCountry = createAsyncThunk(
  "countries/addCountry",
  async (countryData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post("/admin/country/add", countryData, {
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
        "Failed to add country";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCountry = createAsyncThunk(
  "countries/updateCountry",
  async ({ id, countryFormData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.put(
        `/admin/country/update/${id}`,
        countryFormData,
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
        "Failed to update country";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCountry = createAsyncThunk(
  "countries/deleteCountry",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/admin/country/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete country"
      );
    }
  }
);

export const updateCountryStatus = createAsyncThunk(
  "countries/updateCountryStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.patch(
        `/admin/country/status/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.data && response.data.data.length > 0) {
        const updatedCountryFromResponse = response.data.data[0];
        return { id: updatedCountryFromResponse.id, status: updatedCountryFromResponse.status };
      }
      return rejectWithValue(
        "Failed to update country status: Unexpected response structure or empty data array."
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update country status.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  countries: [],
  selectedCountry: null,
  loading: false,
  countryLoading: false,
  error: null,
};

const countrySlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCountry: (state) => {
      state.selectedCountry = null;
      state.countryLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
        state.error = null;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchCountryById.pending, (state) => {
        state.countryLoading = true;
        state.selectedCountry = null;
        state.error = null;
      })
      .addCase(fetchCountryById.fulfilled, (state, action) => {
        state.countryLoading = false;
        state.selectedCountry = action.payload;
        state.error = null;
      })
      .addCase(fetchCountryById.rejected, (state, action) => {
        state.countryLoading = false;
        state.selectedCountry = null;
        state.error = action.payload || action.error.message;
      })

      .addCase(addCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.countries.push(action.payload);
        state.error = null;
      })
      .addCase(addCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCountry.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCountry = action.payload;
        const index = state.countries.findIndex(
          (country) => country.id === updatedCountry.id
        );
        if (index !== -1) {
          state.countries[index] = updatedCountry;
        }
        state.selectedCountry = updatedCountry;
        state.error = null;
      })
      .addCase(updateCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = state.countries.filter((country) => country.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateCountryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCountryStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        state.countries = state.countries.map((country) =>
          country.id === id ? { ...country, status: status } : country
        );
        if (state.selectedCountry && state.selectedCountry.id === id) {
          state.selectedCountry = { ...state.selectedCountry, status: status };
        }
        state.error = null;
      })
      .addCase(updateCountryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedCountry } = countrySlice.actions;
export default countrySlice.reducer;