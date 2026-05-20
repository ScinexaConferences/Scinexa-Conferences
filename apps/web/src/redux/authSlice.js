import { createSlice } from "@reduxjs/toolkit";
import { getTokenExpiryMs, isTokenExpired } from "../utils/jwt";

export const AUTH_STORAGE_KEY = "scinexa-auth";

const emptyAuthState = {
  accessToken: "",
  refreshToken: "",
  user: null,
  sessionExpiresAt: null,
  isAuthenticated: false
};

function loadPersistedAuthState() {
  if (typeof window === "undefined") {
    return emptyAuthState;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return emptyAuthState;
    }

    const parsed = JSON.parse(raw);
    const accessToken = parsed.accessToken ?? "";
    const user = parsed.user ?? null;

    if (!accessToken || !user || isTokenExpired(accessToken, 0)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return emptyAuthState;
    }

    return {
      accessToken,
      refreshToken: parsed.refreshToken ?? "",
      user,
      sessionExpiresAt: getTokenExpiryMs(accessToken),
      isAuthenticated: true
    };
  } catch {
    return emptyAuthState;
  }
}

export function persistAuthState(authState) {
  if (typeof window === "undefined") {
    return;
  }

  if (!authState.accessToken || !authState.user) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      accessToken: authState.accessToken,
      refreshToken: authState.refreshToken,
      user: authState.user
    })
  );
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadPersistedAuthState(),
  reducers: {
    setCredentials(state, action) {
      const accessToken = action.payload.accessToken ?? "";

      state.accessToken = accessToken;
      state.refreshToken = action.payload.refreshToken ?? "";
      state.user = action.payload.user ?? null;
      state.sessionExpiresAt = getTokenExpiryMs(accessToken);
      state.isAuthenticated = Boolean(accessToken && state.user);
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload
        };
      }
    },
    logout(state) {
      state.accessToken = "";
      state.refreshToken = "";
      state.user = null;
      state.sessionExpiresAt = null;
      state.isAuthenticated = false;
    }
  }
});

export const authReducer = authSlice.reducer;
export const { setCredentials, updateUser, logout } = authSlice.actions;
