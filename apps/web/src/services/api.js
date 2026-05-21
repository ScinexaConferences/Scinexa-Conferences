import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";
import { isTokenExpired } from "../utils/jwt";

function createApiClient(baseURL) {
  return axios.create({ baseURL });
}

export const api = createApiClient(import.meta.env.VITE_API_URL ?? "/api/v1");
export const fileApi = createApiClient(import.meta.env.VITE_FILE_API_URL ?? "/api");

function dispatchAuthExpired() {
  store.dispatch(logout());

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("scinexa:auth-expired"));
  }
}

function attachAuthInterceptors(client) {
  client.interceptors.request.use((config) => {
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

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401 && store.getState().auth.isAuthenticated) {
        dispatchAuthExpired();
      }

      return Promise.reject(error);
    }
  );
}

attachAuthInterceptors(api);
attachAuthInterceptors(fileApi);
