import { api } from "./api";

export async function loginAdmin(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data?.data;
}

export async function logoutAdminSession() {
  try {
    await api.post("/auth/logout", {}, { validateStatus: (status) => status < 500 });
  } catch {
    // The backend may not implement logout yet; local logout still completes safely.
  }
}
