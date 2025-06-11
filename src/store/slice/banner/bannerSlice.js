import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api";

export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/banner/list", {
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
        err.response?.data?.message || err.message || "Failed to fetch banners"
      );
    }
  }
);

export const fetchBannerById = createAsyncThunk(
  "banners/fetchBannerById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get(`/admin/banner/by-id/${id}`, {
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
        err.response?.data?.message || err.message || "Failed to fetch banner"
      );
    }
  }
);

export const addBanner = createAsyncThunk(
  "banners/addBanner",
  async (bannerData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post("/admin/banner/add", bannerData, {
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
        "Failed to add banner";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBanner = createAsyncThunk(
  "banners/updateBanner",
  async ({ id, bannerFormData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.put(
        `/admin/banner/update/${id}`,
        bannerFormData,
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
        "Failed to update banner";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banners/deleteBanner",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/admin/banner/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete banner"
      );
    }
  }
);

export const updateBannerStatus = createAsyncThunk(
  "banners/updateBannerStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.patch(
        `/admin/banner/status/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.status === true) {
        return { id: id, status: status };
      } else {
        return rejectWithValue(
          response.data?.message || "Failed to update banner status: Unexpected success response."
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update banner status.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  banners: [],
  selectedBanner: null,
  loading: false,
  bannerLoading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedBanner: (state) => {
      state.selectedBanner = null;
      state.bannerLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
        state.error = null;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchBannerById.pending, (state) => {
        state.bannerLoading = true;
        state.selectedBanner = null;
        state.error = null;
      })
      .addCase(fetchBannerById.fulfilled, (state, action) => {
        state.bannerLoading = false;
        state.selectedBanner = action.payload;
        state.error = null;
      })
      .addCase(fetchBannerById.rejected, (state, action) => {
        state.bannerLoading = false;
        state.selectedBanner = null;
        state.error = action.payload || action.error.message;
      })

      .addCase(addBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
        state.error = null;
      })
      .addCase(addBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBanner = action.payload;
        const index = state.banners.findIndex(
          (banner) => banner.id === updatedBanner.id
        );
        if (index !== -1) {
          state.banners[index] = updatedBanner;
        }
        if (state.selectedBanner && state.selectedBanner.id === updatedBanner.id) {
          state.selectedBanner = updatedBanner;
        }
        state.error = null;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter((banner) => banner.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateBannerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBannerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        state.banners = state.banners.map((banner) =>
          banner.id === id ? { ...banner, status: status } : banner
        );
        if (state.selectedBanner && state.selectedBanner.id === id) {
          state.selectedBanner = { ...state.selectedBanner, status: status };
        }
        state.error = null;
      })
      .addCase(updateBannerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
