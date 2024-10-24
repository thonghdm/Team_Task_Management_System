// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiLoginSuccess,
  apiLoginWithEmail,
  apiRegisterWithEmail,
  apiLogOut,
} from "~/apis/Auth/authService";
import { apiupdateUser } from "~/apis/User/userService";

const initialState = {
  isLoggedIn: false,
  typeLogin: false,
  accesstoken: null,
  userData: {},
  error: null,
  loading: false,
};

export const loginSuccess = createAsyncThunk(
  "auth/loginSuccess",
  async ({ id, tokenLogin }, { rejectWithValue }) => {
    try {
      const response = await apiLoginSuccess(id, tokenLogin);
      if (response?.data.err === 0) {
        return {
          accesstoken: response.data.accesstoken,
          userData: response.data.userData,
        };
      }
      return rejectWithValue(null);
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiLoginWithEmail(email, password);
      if (response) {
        return {
          accesstoken: response.data.userWithToken.accessToken,
          userData: response.data.userWithToken,
        };
      }
      return rejectWithValue("Login failed");
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const registerWithEmail = createAsyncThunk(
  "auth/registerWithEmail",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await apiRegisterWithEmail(name, email, password);
      if (response?.data?.userWithToken) {
        return {
          token: response.data.userWithToken.accessToken,
          userData: response.data.userWithToken,
        };
      }
      throw new Error("Invalid response format");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiLogOut();
      return null;
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ accesstoken, userData }, { rejectWithValue }) => {
    try {
      const response = await apiupdateUser(accesstoken, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Update failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Success
      .addCase(loginSuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSuccess.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.typeLogin = false;
        state.accesstoken = action.payload.accesstoken;
        state.userData = action.payload.userData;
        state.error = null;
      })
      .addCase(loginSuccess.rejected, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.typeLogin = false;
        state.accesstoken = null;
        state.userData = {};
        state.error = null;
      })

      // Login with Email
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.typeLogin = true;
        state.accesstoken = action.payload.accesstoken;
        state.userData = action.payload.userData;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.typeLogin = true;
        state.accesstoken = null;
        state.userData = {};
        state.error = action.payload;
      })

      // Register
      .addCase(registerWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.typeLogin = true;
        state.accesstoken = action.payload.token;
        state.userData = action.payload.userData;
        state.error = null;
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.userData = {};
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userData = action.payload.userData || {};
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;

export const selectAuth = (state) => state.auth;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.userData;
export const selectError = (state) => state.auth.error;
export const selectLoading = (state) => state.auth.loading;
