import { fileApi } from "./api";

export async function uploadManagedFile(file, category) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  const response = await fileApi.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data?.data ?? response.data;
}
