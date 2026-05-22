import { api } from "../services/api";

export function getAuthErrorMessage(error) {
  if (error.code === "ERR_SESSION_EXPIRED") {
    return "Your session expired. Please sign in again.";
  }

  if (error.code === "ERR_NETWORK" || !error.response) {
    return `Cannot reach the API through ${api.defaults.baseURL}. Make sure the backend is running on port 5000 and that apps/web/.env points to the correct backend URL.`;
  }

  const status = error.response?.status;
  const apiMessage = error.response?.data?.message;
  const apiError =
    error.response?.data?.data?.error ??
    error.response?.data?.error ??
    error.response?.data?.data?.message;

  if (status >= 500 && apiError) {
    return `${apiMessage ?? "Server error"}: ${apiError}`;
  }

  return (
    apiMessage ??
    apiError ??
    "Unable to complete the request right now. Please try again."
  );
}
