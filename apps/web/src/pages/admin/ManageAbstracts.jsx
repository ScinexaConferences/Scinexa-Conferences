import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { downloadAbstractAttachment, getAbstractSubmissions } from "../../services/abstractSubmissionService";
import { getAuthErrorMessage } from "../../utils/auth";

function formatDate(value) {
  if (!value) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatStatusLabel(value) {
  if (!value) {
    return "Submitted";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatFileSize(size) {
  if (!size) {
    return "0 KB";
  }

  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

export function ManageAbstracts() {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["abstract-submissions"],
    queryFn: getAbstractSubmissions,
    staleTime: 15000
  });

  const stats = useMemo(() => {
    const countries = new Set(submissions.map((item) => item.country).filter(Boolean));

    return {
      count: submissions.length,
      submittedCount: submissions.filter((item) => item.reviewStatus === "SUBMITTED").length,
      countries: countries.size
    };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return submissions;
    }

    return submissions.filter((submission) =>
      [
        submission.referenceCode,
        submission.firstName,
        submission.lastName,
        submission.email,
        submission.organization,
        submission.country,
        submission.abstractTitle,
        submission.sessionTrack
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [submissions, searchValue]);

  const handleDownload = async (submissionId) => {
    setDownloadError("");

    try {
      const { blob, fileName } = await downloadAbstractAttachment(submissionId);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setDownloadError(getAuthErrorMessage(error));
    }
  };

  return (
    <>
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
        <div className="rounded-[2rem] border border-white/50 bg-white/78 p-6 shadow-[0_25px_70px_rgba(11,22,56,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Abstracts</p>
          <h3 className="mt-3 font-display text-3xl font-bold">Review submitted abstracts</h3>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Abstracts submitted from the public abstract form are listed here with presenter details, track selection, full abstract text, and the uploaded file attachment.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Total abstracts</p>
              <p className="mt-3 font-display text-4xl font-bold">{stats.count}</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Awaiting review</p>
              <p className="mt-3 font-display text-4xl font-bold">{stats.submittedCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Countries represented</p>
              <p className="mt-3 font-display text-4xl font-bold">{stats.countries}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Submission records</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Search by abstract reference, author name, email, organization, country, abstract title, or session track.
              </p>
            </div>
            <label className="block w-full max-w-md">
              <span className="sr-only">Search abstracts</span>
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search abstracts or presenters"
                className="w-full rounded-[1.2rem] border border-black/8 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7f5cff] focus:ring-4 focus:ring-[#ede6ff] dark:border-white/10 dark:bg-white/[0.04]"
              />
            </label>
          </div>

          {downloadError ? (
            <div className="mt-6 rounded-[1rem] border border-[#f1cad2] bg-[#fff1f4] px-4 py-3 text-sm font-medium text-[#a02841]">
              {downloadError}
            </div>
          ) : null}

          <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-black/5 bg-white/80 shadow-[0_16px_38px_rgba(15,24,58,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
            <div className="hidden grid-cols-[140px_minmax(0,1.2fr)_200px_180px_170px_220px] gap-4 border-b border-black/5 bg-black/[0.02] px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 lg:grid">
              <span>Reference</span>
              <span>Presenter & Title</span>
              <span>Track</span>
              <span>Attachment</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/10">
              {isLoading ? (
                <div className="px-5 py-6 text-sm text-slate-500 dark:text-slate-300">Loading abstract submissions...</div>
              ) : filteredSubmissions.length ? (
                filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="grid gap-4 px-5 py-5 lg:grid-cols-[140px_minmax(0,1.2fr)_200px_180px_170px_220px] lg:items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{submission.referenceCode}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{formatDate(submission.createdAt)}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {submission.titlePrefix} {submission.firstName} {submission.lastName}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-300">{submission.abstractTitle}</p>
                      <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-300">{submission.email}</p>
                    </div>

                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">{submission.sessionTrack}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{submission.presentationType}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{submission.country}</p>
                    </div>

                    <div>
                      <p className="truncate font-medium text-slate-800 dark:text-slate-100">{submission.fileName}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{formatFileSize(submission.fileSize)}</p>
                    </div>

                    <div>
                      <span className="inline-flex rounded-full bg-[#e9f9ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#147443]">
                        {formatStatusLabel(submission.reviewStatus)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(submission)}
                        className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                      >
                        View details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(submission.id)}
                        className="inline-flex rounded-full border border-[#d8ecff] bg-[#f2f8ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1d5ea8] transition hover:bg-[#e6f2ff]"
                      >
                        Download file
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-6 text-sm text-slate-500 dark:text-slate-300">
                  {submissions.length ? "No abstract submissions matched your search." : "No abstract submissions yet."}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {selectedSubmission ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#070b16]/60 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/50 bg-white/92 p-6 shadow-[0_35px_90px_rgba(7,11,22,0.2)] dark:border-white/10 dark:bg-[#0d1528]/95"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">Abstract details</p>
                  <h3 className="mt-3 font-display text-3xl font-bold">{selectedSubmission.referenceCode}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(selectedSubmission.id)}
                  className="inline-flex rounded-full border border-[#d8ecff] bg-[#f2f8ff] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#1d5ea8] transition hover:bg-[#e6f2ff]"
                >
                  Download attachment
                </button>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.4rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Presenter details</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="font-semibold">Name:</span> {selectedSubmission.titlePrefix} {selectedSubmission.firstName} {selectedSubmission.lastName}</p>
                    <p><span className="font-semibold">Email:</span> {selectedSubmission.email}</p>
                    <p><span className="font-semibold">Phone:</span> {selectedSubmission.phone}</p>
                    <p><span className="font-semibold">Organization:</span> {selectedSubmission.organization}</p>
                    <p><span className="font-semibold">Department:</span> {selectedSubmission.department || "Not provided"}</p>
                    <p><span className="font-semibold">Country:</span> {selectedSubmission.country}</p>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Submission details</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="font-semibold">Status:</span> {formatStatusLabel(selectedSubmission.reviewStatus)}</p>
                    <p><span className="font-semibold">Presentation Type:</span> {selectedSubmission.presentationType}</p>
                    <p><span className="font-semibold">Session Track:</span> {selectedSubmission.sessionTrack}</p>
                    <p><span className="font-semibold">Submitted At:</span> {formatDate(selectedSubmission.createdAt)}</p>
                    <p><span className="font-semibold">File:</span> {selectedSubmission.fileName}</p>
                    <p><span className="font-semibold">File Size:</span> {formatFileSize(selectedSubmission.fileSize)}</p>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03] md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Abstract title</p>
                  <p className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{selectedSubmission.abstractTitle}</p>
                </div>

                <div className="rounded-[1.4rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03] md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Abstract text</p>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">{selectedSubmission.abstractText}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="inline-flex rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
