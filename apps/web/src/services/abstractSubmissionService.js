import { api } from "./api";

export async function createAbstractSubmission(formData) {
  const response = await api.post("/abstract-submissions", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data?.data;
}

export async function getAbstractSubmissions() {
  const response = await api.get("/abstract-submissions");
  return response.data?.data ?? [];
}

export async function downloadAbstractAttachment(id) {
  const response = await api.get(`/abstract-submissions/${id}/download`, {
    responseType: "blob"
  });

  const disposition = response.headers["content-disposition"] ?? "";
  const fileNameMatch = disposition.match(/filename="?([^"]+)"?/i);

  return {
    blob: response.data,
    fileName: fileNameMatch?.[1] ?? `abstract-${id}.bin`
  };
}
