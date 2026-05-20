import { api } from "./api";

export async function updateAdminPassword(payload) {
  const response = await api.put("/auth/change-password", {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword
  });

  return response.data?.data;
}
