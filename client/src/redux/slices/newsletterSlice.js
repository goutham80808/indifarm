import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// Subscribe to newsletter
export const subscribeToNewsletter = createAsyncThunk(
  "newsletter/subscribe",
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_URL}/newsletter/subscribe`,
        { email },
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

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = createAsyncThunk(
  "newsletter/unsubscribe",
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_URL}/newsletter/unsubscribe`,
        { email },
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

// Get subscriber count
export const getSubscriberCount = createAsyncThunk(
  "newsletter/getSubscriberCount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/newsletter/count`);
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

// Get all subscribers
export const getAllSubscribers = createAsyncThunk(
  "newsletter/getAllSubscribers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/newsletter/subscribers`, config);
      return data; // { success, count, data: subscribers }
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
  subscriberCount: 0,
  subscribers: [],
  loading: false,
  error: null,
  success: false,
};

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    clearNewsletterError: (state) => {
      state.error = null;
    },
    resetNewsletterSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Subscribe
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subscriberCount += 1;
        toast.success(action.payload.message);
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Unsubscribe
      .addCase(unsubscribeFromNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(unsubscribeFromNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subscriberCount = Math.max(0, state.subscriberCount - 1);
        toast.success(action.payload.message);
      })
      .addCase(unsubscribeFromNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Get subscriber count
      .addCase(getSubscriberCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriberCount.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriberCount = action.payload.count;
      })
      .addCase(getSubscriberCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all subscribers
      .addCase(getAllSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload.data || [];
        if (typeof action.payload.count === "number") {
          state.subscriberCount = action.payload.count;
        }
      })
      .addCase(getAllSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNewsletterError, resetNewsletterSuccess } =
  newsletterSlice.actions;

export default newsletterSlice.reducer;
