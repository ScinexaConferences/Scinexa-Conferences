import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { defaultSpeakersSettings } from "../../data/speakersDefaults";
import { getSpeakersSettings, updateSpeakersSettings } from "../../services/siteSettingsService";
import { getAuthErrorMessage } from "../../utils/auth";
import { StatusToast } from "../modals/StatusToast";
import { S3UploadField } from "./S3UploadField";

function cloneDefaults() {
  return {
    speakers: defaultSpeakersSettings.speakers.map((speaker) => ({ ...speaker }))
  };
}

function createEmptySpeaker() {
  return {
    name: "",
    title: "",
    organization: "",
    image: "",
    category: "Speakers"
  };
}

function normalizePayload(form) {
  return {
    speakers: form.speakers.map((speaker) => ({
      name: speaker.name.trim(),
      title: speaker.title.trim(),
      organization: speaker.organization.trim(),
      image: speaker.image.trim(),
      category: speaker.category.trim()
    }))
  };
}

export function SpeakersSettingsForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => cloneDefaults());
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);
  const [editingSpeakerIndex, setEditingSpeakerIndex] = useState(null);
  const [newSpeaker, setNewSpeaker] = useState(() => createEmptySpeaker());
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data } = useQuery({
    queryKey: ["speakers-settings"],
    queryFn: getSpeakersSettings,
    initialData: defaultSpeakersSettings,
    staleTime: 30000
  });

  useEffect(() => {
    setForm({
      speakers: (data?.speakers?.length ? data.speakers : defaultSpeakersSettings.speakers).map((speaker) => ({
        ...speaker
      }))
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
    mutationFn: (payload) => updateSpeakersSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["speakers-settings"], updated);
      setError("");
      setToast("Speakers updated successfully.");
    },
    onError: (requestError) => {
      setError(getAuthErrorMessage(requestError));
    }
  });

  const categoryOptions = useMemo(() => {
    const values = form.speakers.map((speaker) => speaker.category.trim()).filter(Boolean);
    return Array.from(new Set(["Key Note", "Speakers", "Poster", "Virtual", "Delegate", ...values]));
  }, [form.speakers]);

  const handleAddSpeaker = (speaker) => {
    setForm((current) => ({
      ...current,
      speakers: [...current.speakers, speaker]
    }));
    setError("");
  };

  const handleUpdateSpeaker = (index, speaker) => {
    setForm((current) => ({
      ...current,
      speakers: current.speakers.map((currentSpeaker, currentIndex) =>
        currentIndex === index ? speaker : currentSpeaker
      )
    }));
    setError("");
  };

  const handleNewSpeakerChange = (field, value) => {
    setNewSpeaker((current) => ({ ...current, [field]: value }));
  };

  const resetNewSpeaker = () => {
    setNewSpeaker(createEmptySpeaker());
  };

  const openAddSpeakerModal = () => {
    setEditingSpeakerIndex(null);
    resetNewSpeaker();
    setIsSpeakerModalOpen(true);
    setError("");
  };

  const openEditSpeakerModal = (index) => {
    setEditingSpeakerIndex(index);
    setNewSpeaker({ ...form.speakers[index] });
    setIsSpeakerModalOpen(true);
    setError("");
  };

  const handleAddSpeakerSubmit = (event) => {
    event.preventDefault();

    const normalizedSpeaker = {
      name: newSpeaker.name.trim(),
      title: newSpeaker.title.trim(),
      organization: newSpeaker.organization.trim(),
      image: newSpeaker.image.trim(),
      category: newSpeaker.category.trim()
    };

    if (
      !normalizedSpeaker.name ||
      !normalizedSpeaker.title ||
      !normalizedSpeaker.organization ||
      !normalizedSpeaker.image ||
      !normalizedSpeaker.category
    ) {
      setError("Please complete every speaker field before adding the card.");
      return;
    }

    if (editingSpeakerIndex === null) {
      handleAddSpeaker(normalizedSpeaker);
    } else {
      handleUpdateSpeaker(editingSpeakerIndex, normalizedSpeaker);
    }

    resetNewSpeaker();
    setEditingSpeakerIndex(null);
    setIsSpeakerModalOpen(false);
  };

  const handleRemoveSpeaker = (index) => {
    setForm((current) => ({
      ...current,
      speakers: current.speakers.length > 1 ? current.speakers.filter((_, speakerIndex) => speakerIndex !== index) : current.speakers
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.speakers.length) {
      setError("Please keep at least one speaker card.");
      return;
    }

    const hasEmptyField = form.speakers.some(
      (speaker) =>
        !speaker.name.trim() ||
        !speaker.title.trim() ||
        !speaker.organization.trim() ||
        !speaker.image.trim() ||
        !speaker.category.trim()
    );

    if (hasEmptyField) {
      setError("Please complete every speaker field before saving.");
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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Speakers manager</p>
        <h3 className="mt-3 font-display text-3xl font-bold">Manage speaker cards and categories</h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          These speaker cards power the public speakers page and the speaker previews used across the conference site.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                Speaker library
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Add, remove, and recategorize speaker cards shown on the public page.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddSpeakerModal}
              className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-5 py-2.5 text-sm font-semibold text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            >
              Add speaker
            </button>
          </div>

          <div className="overflow-hidden rounded-[1.8rem] border border-black/5 bg-white/80 shadow-[0_16px_38px_rgba(15,24,58,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
            <div className="hidden grid-cols-[84px_minmax(0,1.2fr)_minmax(0,1fr)_180px_250px] gap-4 border-b border-black/5 bg-black/[0.02] px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 lg:grid">
              <span>Photo</span>
              <span>Speaker</span>
              <span>Role</span>
              <span>Category</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/10">
              {form.speakers.map((speaker, index) => (
                <div
                  key={`${speaker.name}-${index}`}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[84px_minmax(0,1.2fr)_minmax(0,1fr)_180px_250px] lg:items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="h-16 w-16 rounded-2xl border border-black/5 object-cover dark:border-white/10"
                    />
                    <div className="lg:hidden">
                      <p className="font-semibold text-slate-900 dark:text-white">{speaker.name}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{speaker.title}</p>
                    </div>
                  </div>

                  <div className="hidden min-w-0 lg:block">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{speaker.name}</p>
                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-300">{speaker.organization}</p>
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-100">{speaker.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300 lg:hidden">{speaker.organization}</p>
                  </div>

                  <div>
                    <span className="inline-flex rounded-full border border-[#ddd7ff] bg-[#f8f4ff] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#592bcb] dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
                      {speaker.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openEditSpeakerModal(index)}
                      className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpeaker(index)}
                      disabled={form.speakers.length === 1}
                      className="inline-flex rounded-full border border-[#f4ccd6] bg-[#fff1f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#991f3d] transition hover:bg-[#ffe7ef] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#7a2940] dark:bg-[#461224] dark:text-[#ffdbe5]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <datalist id="speaker-category-options">
            {categoryOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>

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
              {mutation.isPending ? "Saving..." : "Save speakers"}
            </button>
          </div>
        </form>
      </motion.section>

      <AnimatePresence>
        {isSpeakerModalOpen ? (
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
                {editingSpeakerIndex === null ? "Add speaker" : "Edit speaker"}
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold">
                {editingSpeakerIndex === null ? "Create a new speaker card" : "Update speaker details"}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Fill out the speaker details below. The row will be updated in the managed speakers list after you confirm.
              </p>

              <form onSubmit={handleAddSpeakerSubmit} className="mt-6 space-y-5">
                <div className="grid gap-4 xl:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">Name</span>
                    <input
                      type="text"
                      value={newSpeaker.name}
                      onChange={(event) => handleNewSpeakerChange("name", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">Category</span>
                    <input
                      list="speaker-category-options"
                      value={newSpeaker.category}
                      onChange={(event) => handleNewSpeakerChange("category", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">Title</span>
                    <input
                      type="text"
                      value={newSpeaker.title}
                      onChange={(event) => handleNewSpeakerChange("title", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">Organization</span>
                    <input
                      type="text"
                      value={newSpeaker.organization}
                      onChange={(event) => handleNewSpeakerChange("organization", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>
                </div>

                <S3UploadField
                  label="Speaker image"
                  value={newSpeaker.image}
                  onChange={(value) => handleNewSpeakerChange("image", value)}
                  category="speakers"
                  placeholder="Paste an image URL or upload a speaker photo"
                  onUploadStateChange={setIsUploadingImage}
                  required
                />

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSpeakerModalOpen(false);
                      setEditingSpeakerIndex(null);
                      resetNewSpeaker();
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingImage}
                    className="inline-flex items-center justify-center rounded-full bg-[#241133] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(36,17,51,0.2)] transition hover:bg-[#34154b]"
                  >
                    {isUploadingImage ? "Uploading..." : editingSpeakerIndex === null ? "Add speaker" : "Save changes"}
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
