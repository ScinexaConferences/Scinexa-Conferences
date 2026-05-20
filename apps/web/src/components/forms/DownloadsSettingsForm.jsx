import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultDownloadsSettings } from "../../data/downloadsDefaults";
import { getDownloadsSettings, updateDownloadsSettings } from "../../services/siteSettingsService";
import { getAuthErrorMessage } from "../../utils/auth";
import { StatusToast } from "../modals/StatusToast";

function cloneDefaults() {
  return {
    resources: defaultDownloadsSettings.resources.map((resource) => ({ ...resource }))
  };
}

function createEmptyResource() {
  return {
    title: "",
    description: "",
    image: "",
    actionLabel: "Download",
    actionTo: "/downloads"
  };
}

function normalizePayload(form) {
  return {
    resources: form.resources.map((resource) => ({
      title: resource.title.trim(),
      description: resource.description.trim(),
      image: resource.image.trim(),
      actionLabel: resource.actionLabel.trim(),
      actionTo: resource.actionTo.trim()
    }))
  };
}

export function DownloadsSettingsForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => cloneDefaults());
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResourceIndex, setEditingResourceIndex] = useState(null);
  const [draftResource, setDraftResource] = useState(() => createEmptyResource());

  const { data } = useQuery({
    queryKey: ["downloads-settings"],
    queryFn: getDownloadsSettings,
    initialData: defaultDownloadsSettings,
    staleTime: 30000
  });

  useEffect(() => {
    setForm({
      resources: (data?.resources?.length ? data.resources : defaultDownloadsSettings.resources).map((resource) => ({ ...resource }))
    });
  }, [data]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const mutation = useMutation({
    mutationFn: (payload) => updateDownloadsSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["downloads-settings"], updated);
      setError("");
      setToast("Downloads updated successfully.");
    },
    onError: (requestError) => {
      setError(getAuthErrorMessage(requestError));
    }
  });

  const resetDraftResource = () => {
    setDraftResource(createEmptyResource());
  };

  const openAddResourceModal = () => {
    setEditingResourceIndex(null);
    resetDraftResource();
    setIsResourceModalOpen(true);
    setError("");
  };

  const openEditResourceModal = (index) => {
    setEditingResourceIndex(index);
    setDraftResource({ ...form.resources[index] });
    setIsResourceModalOpen(true);
    setError("");
  };

  const handleDraftChange = (field, value) => {
    setDraftResource((current) => ({ ...current, [field]: value }));
  };

  const handleRemoveResource = (index) => {
    setForm((current) => ({
      ...current,
      resources: current.resources.length > 1 ? current.resources.filter((_, resourceIndex) => resourceIndex !== index) : current.resources
    }));
    setError("");
  };

  const handleResourceSubmit = (event) => {
    event.preventDefault();

    const normalizedResource = {
      title: draftResource.title.trim(),
      description: draftResource.description.trim(),
      image: draftResource.image.trim(),
      actionLabel: draftResource.actionLabel.trim(),
      actionTo: draftResource.actionTo.trim()
    };

    if (
      !normalizedResource.title ||
      !normalizedResource.description ||
      !normalizedResource.image ||
      !normalizedResource.actionLabel ||
      !normalizedResource.actionTo
    ) {
      setError("Please complete every downloads field before saving the resource.");
      return;
    }

    setForm((current) => ({
      ...current,
      resources:
        editingResourceIndex === null
          ? [...current.resources, normalizedResource]
          : current.resources.map((resource, index) => (index === editingResourceIndex ? normalizedResource : resource))
    }));

    setEditingResourceIndex(null);
    resetDraftResource();
    setIsResourceModalOpen(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.resources.length) {
      setError("Please keep at least one download resource.");
      return;
    }

    const hasEmptyField = form.resources.some(
      (resource) =>
        !resource.title.trim() ||
        !resource.description.trim() ||
        !resource.image.trim() ||
        !resource.actionLabel.trim() ||
        !resource.actionTo.trim()
    );

    if (hasEmptyField) {
      setError("Please complete every downloads field before saving.");
      return;
    }

    await mutation.mutateAsync(normalizePayload(form));
  };

  return (
    <>
      <StatusToast message={toast} />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="rounded-[2rem] border border-white/50 bg-white/78 p-6 shadow-[0_25px_70px_rgba(11,22,56,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] sm:p-7"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Downloads manager</p>
        <h3 className="mt-3 font-display text-3xl font-bold">Manage downloadable resources</h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          These resource cards power the public downloads page and the downloads preview shown on the homepage.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                Downloads library
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Add, edit, and remove brochure, template, and schedule cards shown on the public page.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddResourceModal}
              className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-5 py-2.5 text-sm font-semibold text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            >
              Add resource
            </button>
          </div>

          <div className="overflow-hidden rounded-[1.8rem] border border-black/5 bg-white/80 shadow-[0_16px_38px_rgba(15,24,58,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
            <div className="hidden grid-cols-[84px_minmax(0,1.1fr)_160px_160px_240px] gap-4 border-b border-black/5 bg-black/[0.02] px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 lg:grid">
              <span>Image</span>
              <span>Resource</span>
              <span>Button</span>
              <span>Destination</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/10">
              {form.resources.map((resource, index) => (
                <div
                  key={`${resource.title}-${index}`}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[84px_minmax(0,1.1fr)_160px_160px_240px] lg:items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={resource.image}
                      alt={resource.title}
                      className="h-16 w-16 rounded-2xl border border-black/5 object-cover dark:border-white/10"
                    />
                    <div className="lg:hidden">
                      <p className="font-semibold text-slate-900 dark:text-white">{resource.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{resource.actionLabel}</p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{resource.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-300">{resource.description}</p>
                  </div>

                  <div>
                    <span className="inline-flex rounded-full border border-[#ddd7ff] bg-[#f8f4ff] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#592bcb] dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
                      {resource.actionLabel}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{resource.actionTo}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openEditResourceModal(index)}
                      className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveResource(index)}
                      disabled={form.resources.length === 1}
                      className="inline-flex rounded-full border border-[#f4ccd6] bg-[#fff1f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#991f3d] transition hover:bg-[#ffe7ef] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#7a2940] dark:bg-[#461224] dark:text-[#ffdbe5]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error ? (
            <div className="rounded-[1rem] border border-[#f1cad2] bg-[#fff1f4] px-4 py-3 text-sm font-medium text-[#a02841]">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex rounded-full bg-[#241133] px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(36,17,51,0.2)] transition hover:-translate-y-0.5 hover:bg-[#34154b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mutation.isPending ? "Saving..." : "Save downloads"}
            </button>
          </div>
        </form>
      </motion.section>

      <AnimatePresence>
        {isResourceModalOpen ? (
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
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/50 bg-white/92 p-6 shadow-[0_35px_90px_rgba(7,11,22,0.2)] dark:border-white/10 dark:bg-[#0d1528]/95"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
                {editingResourceIndex === null ? "Add resource" : "Edit resource"}
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold">
                {editingResourceIndex === null ? "Create a new downloads card" : "Update downloads resource"}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Fill out the downloads details below. The row will update after you confirm.
              </p>

              <form onSubmit={handleResourceSubmit} className="mt-6 space-y-5">
                <div className="grid gap-4 xl:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">Title</span>
                    <input
                      type="text"
                      value={draftResource.title}
                      onChange={(event) => handleDraftChange("title", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">Button label</span>
                    <input
                      type="text"
                      value={draftResource.actionLabel}
                      onChange={(event) => handleDraftChange("actionLabel", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold">Description</span>
                  <textarea
                    value={draftResource.description}
                    onChange={(event) => handleDraftChange("description", event.target.value)}
                    rows={4}
                    className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </label>

                <div className="grid gap-4 xl:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">Image URL</span>
                    <input
                      type="url"
                      value={draftResource.image}
                      onChange={(event) => handleDraftChange("image", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">Destination</span>
                    <input
                      type="text"
                      value={draftResource.actionTo}
                      onChange={(event) => handleDraftChange("actionTo", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResourceModalOpen(false);
                      setEditingResourceIndex(null);
                      resetDraftResource();
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-[#241133] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(36,17,51,0.2)] transition hover:bg-[#34154b]"
                  >
                    {editingResourceIndex === null ? "Add resource" : "Save changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
