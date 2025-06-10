import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api";

export const fetchStates = createAsyncThunk(
  "states/fetchStates",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get("/admin/state/list", {
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
          "Failed to fetch states"
      );
    }
  }
);

export const fetchStateById = createAsyncThunk(
  "states/fetchStateById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await API.get(`/admin/state/by-id/${id}`, {
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
        err.response?.data?.message || err.message || "Failed to fetch state"
      );
    }
  }
);

export const addState = createAsyncThunk(
  "states/addState",
  async (stateData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post("/admin/state/add", stateData, {
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
        "Failed to add state";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateState = createAsyncThunk(
  "states/updateState",
  async ({ id, stateData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.put(
        `/admin/state/update/${id}`,
        stateData,
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
        "Failed to update state";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteState = createAsyncThunk(
  "states/deleteState",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/admin/state/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete state"
      );
    }
  }
);

export const updateStateStatus = createAsyncThunk(
  "states/updateStateStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.patch(
        `/admin/state/status/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.data && response.data.data.length > 0) {
        const updatedStateFromResponse = response.data.data[0];
        return {
          id: updatedStateFromResponse.id,
          status: updatedStateFromResponse.status,
        };
      }
      return rejectWithValue(
        "Failed to update state status: Unexpected response structure or empty data array."
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update state status.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  states: [],
  selectedState: null,
  loading: false,
  stateLoading: false,
  error: null,
};

const stateSlice = createSlice({
  name: "states",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedState: (state) => {
      state.selectedState = null;
      state.stateLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
        state.error = null;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchStateById.pending, (state) => {
        state.stateLoading = true;
        state.selectedState = null;
        state.error = null;
      })
      .addCase(fetchStateById.fulfilled, (state, action) => {
        state.stateLoading = false;
        state.selectedState = action.payload;
        state.error = null;
      })
      .addCase(fetchStateById.rejected, (state, action) => {
        state.stateLoading = false;
        state.selectedState = null;
        state.error = action.payload || action.error.message;
      })

      .addCase(addState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addState.fulfilled, (state, action) => {
        state.loading = false;
        // state.states.push(action.payload);
        state.error = null;
      })
      .addCase(addState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateState.fulfilled, (state, action) => {
        state.loading = false;
        const updatedState = action.payload;
        const index = state.states.findIndex(
          (stateItem) => stateItem.id === updatedState.id
        );
        if (index !== -1) {
          state.states[index] = { ...state.states[index], ...updatedState };
        }
        state.selectedState = updatedState;
        state.error = null;
      })
      .addCase(updateState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteState.fulfilled, (state, action) => {
        state.loading = false;
        state.states = state.states.filter(
          (stateItem) => stateItem.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateStateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStateStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        state.states = state.states.map((stateItem) =>
          stateItem.id === id ? { ...stateItem, status: status } : stateItem
        );
        if (state.selectedState && state.selectedState.id === id) {
          state.selectedState = { ...state.selectedState, status: status };
        }
        state.error = null;
      })
      .addCase(updateStateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedState } = stateSlice.actions;
export default stateSlice.reducer;