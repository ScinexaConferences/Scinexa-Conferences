import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";
import { isTokenExpired } from "../utils/jwt";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1"
});

function dispatchAuthExpired() {
  store.dispatch(logout());

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("scinexa:auth-expired"));
  }
}

api.interceptors.request.use((config) => {
  const { auth } = store.getState();

  if (auth?.accessToken) {
    if (isTokenExpired(auth.accessToken)) {
      dispatchAuthExpired();

      const sessionError = new Error("Session expired");
      sessionError.code = "ERR_SESSION_EXPIRED";

      return Promise.reject(sessionError);
    }

    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && store.getState().auth.isAuthenticated) {
      dispatchAuthExpired();
    }

    return Promise.reject(error);
  }
);
