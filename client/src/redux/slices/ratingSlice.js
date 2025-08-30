import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// ...existing code...
export const createRating = createAsyncThunk(
  "rating/createRating",
  async (ratingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/ratings`,
        ratingData,
        config
      );

      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// ...existing code...
export const getFarmerRatings = createAsyncThunk(
  "rating/getFarmerRatings",
  async ({ farmerId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/ratings/farmer/${farmerId}?page=${page}&limit=${limit}`
      );

      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// ...existing code...
export const getOrderRating = createAsyncThunk(
  "rating/getOrderRating",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/ratings/order/${orderId}`,
        config
      );

      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// ...existing code...
export const updateRating = createAsyncThunk(
  "rating/updateRating",
  async ({ ratingId, ratingData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/ratings/${ratingId}`,
        ratingData,
        config
      );

      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// ...existing code...
export const deleteRating = createAsyncThunk(
  "rating/deleteRating",
  async (ratingId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(
        `${API_URL}/ratings/${ratingId}`,
        config
      );

      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  farmerRatings: [],
  currentOrderRating: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 0,
    total: 0,
  },
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrderRating: (state) => {
      state.currentOrderRating = null;
    },
  },
  extraReducers: (builder) => {
    builder
  // ...existing code...
      .addCase(createRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRating.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Rating submitted successfully!");
      })
      .addCase(createRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  // ...existing code...
      .addCase(getFarmerRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFarmerRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerRatings = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getFarmerRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  // ...existing code...
      .addCase(getOrderRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderRating.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrderRating = action.payload.data;
      })
      .addCase(getOrderRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  // ...existing code...
      .addCase(updateRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrderRating = action.payload.data;
        toast.success("Rating updated successfully!");
      })
      .addCase(updateRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  // ...existing code...
      .addCase(deleteRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrderRating = null;
        toast.success("Rating deleted successfully!");
      })
      .addCase(deleteRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearError, clearCurrentOrderRating } = ratingSlice.actions;

export default ratingSlice.reducer;
