import { useId, useState } from "react";
import { uploadManagedFile } from "../../services/fileService";
import { getAuthErrorMessage } from "../../utils/auth";

function isPreviewableImage(url) {
  return /^https?:\/\//i.test(url) || url.startsWith("data:image/");
}

export function S3UploadField({
  label,
  value,
  onChange,
  category,
  placeholder = "https://...",
  accept = "image/png,image/jpeg,image/jpg",
  helperText = "Paste an existing URL or upload a file directly to S3.",
  className = "",
  onUploadStateChange,
  required = false
}) {
  const inputId = useId();
  const urlInputId = `${inputId}-url`;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const setUploadingState = (nextState) => {
    setIsUploading(nextState);
    onUploadStateChange?.(nextState);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setUploadError("");
    setUploadingState(true);

    try {
      const uploaded = await uploadManagedFile(selectedFile, category);
      onChange(uploaded.fileUrl ?? "");
    } catch (error) {
      setUploadError(getAuthErrorMessage(error));
    } finally {
      setUploadingState(false);
      event.target.value = "";
    }
  };

  return (
    <div className={`block space-y-2 ${className}`.trim()}>
      <label htmlFor={urlInputId} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={urlInputId}
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
      />

      <div className="flex flex-col gap-3 rounded-[1rem] border border-dashed border-[#d9d0ff] bg-[#faf7ff] p-3 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{helperText}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Uploads into the <span className="font-semibold">{category}</span> folder.</p>
        </div>

        <div className="flex items-center gap-3">
          <input id={inputId} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
          <label
            htmlFor={inputId}
            className={`inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
              isUploading
                ? "cursor-wait bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                : "bg-[#241133] text-white shadow-[0_15px_30px_rgba(36,17,51,0.16)] hover:bg-[#34154b]"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload to S3"}
          </label>
        </div>
      </div>

      {uploadError ? (
        <p className="text-sm font-medium text-[#a02841]">{uploadError}</p>
      ) : null}

      {value && isPreviewableImage(value) ? (
        <img
          src={value}
          alt={label}
          className="h-24 w-24 rounded-2xl border border-black/5 object-cover dark:border-white/10"
        />
      ) : null}
    </div>
  );
}
