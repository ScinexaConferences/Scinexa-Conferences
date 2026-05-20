import { api } from "./api";

export async function createRegistration(payload) {
  const response = await api.post("/registrations", payload);
  return response.data?.data;
}

export async function getRegistrations() {
  const response = await api.get("/registrations");
  return response.data?.data ?? [];
}
