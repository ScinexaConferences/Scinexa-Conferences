import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultContentSettings } from "../../data/contentDefaults";
import { getContentSettings, updateContentSettings } from "../../services/siteSettingsService";
import { getAuthErrorMessage } from "../../utils/auth";
import { StatusToast } from "../modals/StatusToast";
import { S3UploadField } from "./S3UploadField";

function cloneSettings(settings) {
  return {
    about: {
      ...settings.about,
      paragraphs: [...settings.about.paragraphs]
    },
    sessions: {
      ...settings.sessions,
      sessions: settings.sessions.sessions.map((session) => ({ ...session }))
    },
    abstractSection: {
      ...settings.abstractSection,
      guidelines: [...settings.abstractSection.guidelines],
      topics: [...settings.abstractSection.topics],
      beforeSubmit: [...settings.abstractSection.beforeSubmit],
      countries: [...settings.abstractSection.countries],
      presentationTypes: [...settings.abstractSection.presentationTypes],
      authorTitles: [...settings.abstractSection.authorTitles]
    }
  };
}

function createEmptySession() {
  return {
    id: "",
    title: "",
    description: "",
    image: "",
    format: "",
    track: "",
    day: "Day-01",
    actionLabel: "View Details",
    actionTo: "/abstract"
  };
}

function normalizeStringList(values) {
  return values.map((value) => value.trim()).filter(Boolean);
}

function normalizePayload(form) {
  return {
    about: {
      ...form.about,
      eyebrow: form.about.eyebrow.trim(),
      title: form.about.title.trim(),
      description: form.about.description.trim(),
      image: form.about.image.trim(),
      overlayLabel: form.about.overlayLabel.trim(),
      overlayTitle: form.about.overlayTitle.trim(),
      overlaySubtitle: form.about.overlaySubtitle.trim(),
      ctaLabel: form.about.ctaLabel.trim(),
      ctaTo: form.about.ctaTo.trim(),
      paragraphs: normalizeStringList(form.about.paragraphs)
    },
    sessions: {
      ...form.sessions,
      eyebrow: form.sessions.eyebrow.trim(),
      title: form.sessions.title.trim(),
      description: form.sessions.description.trim(),
      ctaTitle: form.sessions.ctaTitle.trim(),
      ctaDescription: form.sessions.ctaDescription.trim(),
      ctaLabel: form.sessions.ctaLabel.trim(),
      ctaTo: form.sessions.ctaTo.trim(),
      sessions: form.sessions.sessions.map((session) => ({
        ...session,
        id: session.id?.trim(),
        title: session.title.trim(),
        description: session.description.trim(),
        image: session.image.trim(),
        format: session.format.trim(),
        track: session.track.trim(),
        day: session.day.trim(),
        actionLabel: session.actionLabel.trim(),
        actionTo: session.actionTo.trim()
      }))
    },
    abstractSection: {
      ...form.abstractSection,
      eyebrow: form.abstractSection.eyebrow.trim(),
      title: form.abstractSection.title.trim(),
      description: form.abstractSection.description.trim(),
      templateLabel: form.abstractSection.templateLabel.trim(),
      templateTo: form.abstractSection.templateTo.trim(),
      guidelines: normalizeStringList(form.abstractSection.guidelines),
      topics: normalizeStringList(form.abstractSection.topics),
      beforeSubmit: normalizeStringList(form.abstractSection.beforeSubmit),
      countries: normalizeStringList(form.abstractSection.countries),
      presentationTypes: normalizeStringList(form.abstractSection.presentationTypes),
      authorTitles: normalizeStringList(form.abstractSection.authorTitles)
    }
  };
}

function EditableStringList({ title, description, values, onChange, onAdd, onRemove, placeholder }) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">{title}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
        >
          Add item
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {values.map((value, index) => (
          <div key={`${title}-${index}`} className="flex gap-3">
            <input
              value={value}
              onChange={(event) => onChange(index, event.target.value)}
              placeholder={placeholder}
              className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={values.length === 1}
              className="inline-flex shrink-0 rounded-full border border-[#f4ccd6] bg-[#fff1f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#991f3d] transition hover:bg-[#ffe7ef] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#7a2940] dark:bg-[#461224] dark:text-[#ffdbe5]"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContentSettingsForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => cloneSettings(defaultContentSettings));
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSessionIndex, setEditingSessionIndex] = useState(null);
  const [draftSession, setDraftSession] = useState(() => createEmptySession());
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);

  const { data } = useQuery({
    queryKey: ["content-settings"],
    queryFn: getContentSettings,
    initialData: defaultContentSettings,
    staleTime: 30000
  });

  useEffect(() => {
    setForm(cloneSettings(data ?? defaultContentSettings));
  }, [data]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const mutation = useMutation({
    mutationFn: (payload) => updateContentSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["content-settings"], updated);
      setToast("Core page content updated successfully.");
      setError("");
    },
    onError: (requestError) => {
      setError(getAuthErrorMessage(requestError));
    }
  });

  const dayOptions = useMemo(
    () => Array.from(new Set(form.sessions.sessions.map((session) => session.day).filter(Boolean))).concat("Day-01", "Day-02", "Day-03").filter((value, index, array) => array.indexOf(value) === index),
    [form.sessions.sessions]
  );

  const handleSectionFieldChange = (section, field, value) => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value
      }
    }));
    setError("");
  };

  const handleListChange = (section, field, index, value) => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: current[section][field].map((item, itemIndex) => (itemIndex === index ? value : item))
      }
    }));
    setError("");
  };

  const addListItem = (section, field, value = "") => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: [...current[section][field], value]
      }
    }));
    setError("");
  };

  const removeListItem = (section, field, index) => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]:
          current[section][field].length > 1
            ? current[section][field].filter((_, itemIndex) => itemIndex !== index)
            : current[section][field]
      }
    }));
    setError("");
  };

  const openAddSessionModal = () => {
    setEditingSessionIndex(null);
    setDraftSession(createEmptySession());
    setIsSessionModalOpen(true);
  };

  const openEditSessionModal = (index) => {
    setEditingSessionIndex(index);
    setDraftSession({ ...form.sessions.sessions[index] });
    setIsSessionModalOpen(true);
  };

  const handleRemoveSession = (index) => {
    setForm((current) => ({
      ...current,
      sessions: {
        ...current.sessions,
        sessions: current.sessions.sessions.length > 1 ? current.sessions.sessions.filter((_, itemIndex) => itemIndex !== index) : current.sessions.sessions
      }
    }));
    setError("");
  };

  const handleSessionSubmit = (event) => {
    event.preventDefault();

    const normalizedSession = {
      ...draftSession,
      title: draftSession.title.trim(),
      description: draftSession.description.trim(),
      image: draftSession.image.trim(),
      format: draftSession.format.trim(),
      track: draftSession.track.trim(),
      day: draftSession.day.trim(),
      actionLabel: draftSession.actionLabel.trim(),
      actionTo: draftSession.actionTo.trim()
    };

    if (
      !normalizedSession.title ||
      !normalizedSession.description ||
      !normalizedSession.image ||
      !normalizedSession.format ||
      !normalizedSession.track ||
      !normalizedSession.day ||
      !normalizedSession.actionLabel ||
      !normalizedSession.actionTo
    ) {
      setError("Please complete every session field before saving.");
      return;
    }

    setForm((current) => ({
      ...current,
      sessions: {
        ...current.sessions,
        sessions:
          editingSessionIndex === null
            ? [...current.sessions.sessions, normalizedSession]
            : current.sessions.sessions.map((session, index) => (index === editingSessionIndex ? normalizedSession : session))
      }
    }));

    setIsSessionModalOpen(false);
    setEditingSessionIndex(null);
    setDraftSession(createEmptySession());
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = normalizePayload(form);
    const aboutValues = [
      payload.about.eyebrow,
      payload.about.title,
      payload.about.description,
      payload.about.image,
      payload.about.overlayLabel,
      payload.about.overlayTitle,
      payload.about.overlaySubtitle,
      payload.about.ctaLabel,
      payload.about.ctaTo
    ];
    const sessionsValues = [
      payload.sessions.eyebrow,
      payload.sessions.title,
      payload.sessions.description,
      payload.sessions.ctaTitle,
      payload.sessions.ctaDescription,
      payload.sessions.ctaLabel,
      payload.sessions.ctaTo
    ];
    const abstractValues = [
      payload.abstractSection.eyebrow,
      payload.abstractSection.title,
      payload.abstractSection.description,
      payload.abstractSection.templateLabel,
      payload.abstractSection.templateTo
    ];

    if (
      aboutValues.some((value) => !value) ||
      !payload.about.paragraphs.length ||
      sessionsValues.some((value) => !value) ||
      !payload.sessions.sessions.length ||
      abstractValues.some((value) => !value) ||
      !payload.abstractSection.guidelines.length ||
      !payload.abstractSection.topics.length ||
      !payload.abstractSection.beforeSubmit.length ||
      !payload.abstractSection.countries.length ||
      !payload.abstractSection.presentationTypes.length ||
      !payload.abstractSection.authorTitles.length
    ) {
      setError("Please complete every required content field before saving.");
      return;
    }

    await mutation.mutateAsync(payload);
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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Core content</p>
        <h3 className="mt-3 font-display text-3xl font-bold">Manage About, Sessions, and Abstract content</h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          These fields drive the public About page, Sessions directory, Abstract page, and the matching homepage sections. Changes update the same shared payload used across the website.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="rounded-[1.8rem] border border-black/5 bg-white/80 p-5 shadow-[0_16px_38px_rgba(15,24,58,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">About page</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <input value={form.about.eyebrow} onChange={(event) => handleSectionFieldChange("about", "eyebrow", event.target.value)} placeholder="Eyebrow" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <input value={form.about.ctaLabel} onChange={(event) => handleSectionFieldChange("about", "ctaLabel", event.target.value)} placeholder="CTA label" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <input value={form.about.title} onChange={(event) => handleSectionFieldChange("about", "title", event.target.value)} placeholder="Title" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />
              <textarea value={form.about.description} onChange={(event) => handleSectionFieldChange("about", "description", event.target.value)} placeholder="Description" rows="4" className="w-full rounded-[1.2rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />
              <S3UploadField
                label="About cover image"
                value={form.about.image}
                onChange={(value) => handleSectionFieldChange("about", "image", value)}
                category="banners"
                placeholder="Paste an image URL or upload the about cover image"
                className="lg:col-span-2"
                onUploadStateChange={setIsUploadingAsset}
                required
              />
              <input value={form.about.overlayLabel} onChange={(event) => handleSectionFieldChange("about", "overlayLabel", event.target.value)} placeholder="Overlay label" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <input value={form.about.overlayTitle} onChange={(event) => handleSectionFieldChange("about", "overlayTitle", event.target.value)} placeholder="Overlay title" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <input value={form.about.overlaySubtitle} onChange={(event) => handleSectionFieldChange("about", "overlaySubtitle", event.target.value)} placeholder="Overlay subtitle" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <input value={form.about.ctaTo} onChange={(event) => handleSectionFieldChange("about", "ctaTo", event.target.value)} placeholder="CTA link" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
            </div>

            <div className="mt-5">
              <EditableStringList
                title="About paragraphs"
                description="These paragraphs are reused on the homepage About block and the full About page."
                values={form.about.paragraphs}
                onChange={(index, value) => handleListChange("about", "paragraphs", index, value)}
                onAdd={() => addListItem("about", "paragraphs")}
                onRemove={(index) => removeListItem("about", "paragraphs", index)}
                placeholder="Enter a paragraph"
              />
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-black/5 bg-white/80 p-5 shadow-[0_16px_38px_rgba(15,24,58,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Sessions page</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Manage the sessions page header and the session cards shown on the public sessions directory.</p>
              </div>
              <button
                type="button"
                onClick={openAddSessionModal}
                className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
              >
                Add session
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <input value={form.sessions.eyebrow} onChange={(event) => handleSectionFieldChange("sessions", "eyebrow", event.target.value)} placeholder="Eyebrow" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <input value={form.sessions.ctaLabel} onChange={(event) => handleSectionFieldChange("sessions", "ctaLabel", event.target.value)} placeholder="CTA button label" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <input value={form.sessions.title} onChange={(event) => handleSectionFieldChange("sessions", "title", event.target.value)} placeholder="Title" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />
              <textarea value={form.sessions.description} onChange={(event) => handleSectionFieldChange("sessions", "description", event.target.value)} placeholder="Description" rows="4" className="w-full rounded-[1.2rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />
              <input value={form.sessions.ctaTitle} onChange={(event) => handleSectionFieldChange("sessions", "ctaTitle", event.target.value)} placeholder="CTA title" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <input value={form.sessions.ctaTo} onChange={(event) => handleSectionFieldChange("sessions", "ctaTo", event.target.value)} placeholder="CTA link" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <textarea value={form.sessions.ctaDescription} onChange={(event) => handleSectionFieldChange("sessions", "ctaDescription", event.target.value)} placeholder="CTA description" rows="3" className="w-full rounded-[1.2rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-black/5 bg-white/90 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="hidden grid-cols-[minmax(0,1.1fr)_120px_120px_220px] gap-4 border-b border-black/5 bg-black/[0.02] px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 lg:grid">
                <span>Session</span>
                <span>Day</span>
                <span>Track</span>
                <span>Actions</span>
              </div>
              <div className="divide-y divide-black/5 dark:divide-white/10">
                {form.sessions.sessions.map((session, index) => (
                  <div key={session.id || `${session.title}-${index}`} className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1.1fr)_120px_120px_220px] lg:items-center">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">{session.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-300">{session.description}</p>
                    </div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{session.day}</div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{session.track}</div>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={() => openEditSessionModal(index)} className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white">Edit</button>
                      <button type="button" onClick={() => handleRemoveSession(index)} disabled={form.sessions.sessions.length === 1} className="inline-flex rounded-full border border-[#f4ccd6] bg-[#fff1f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#991f3d] transition hover:bg-[#ffe7ef] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#7a2940] dark:bg-[#461224] dark:text-[#ffdbe5]">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-black/5 bg-white/80 p-5 shadow-[0_16px_38px_rgba(15,24,58,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Abstract page</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <input value={form.abstractSection.eyebrow} onChange={(event) => handleSectionFieldChange("abstractSection", "eyebrow", event.target.value)} placeholder="Eyebrow" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <input value={form.abstractSection.templateLabel} onChange={(event) => handleSectionFieldChange("abstractSection", "templateLabel", event.target.value)} placeholder="Template button label" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
              <input value={form.abstractSection.title} onChange={(event) => handleSectionFieldChange("abstractSection", "title", event.target.value)} placeholder="Title" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />
              <textarea value={form.abstractSection.description} onChange={(event) => handleSectionFieldChange("abstractSection", "description", event.target.value)} placeholder="Description" rows="4" className="w-full rounded-[1.2rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />
              <input value={form.abstractSection.templateTo} onChange={(event) => handleSectionFieldChange("abstractSection", "templateTo", event.target.value)} placeholder="Template link" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              <EditableStringList
                title="Guidelines"
                description="Public abstract guidelines shown in the left panel and homepage abstract preview."
                values={form.abstractSection.guidelines}
                onChange={(index, value) => handleListChange("abstractSection", "guidelines", index, value)}
                onAdd={() => addListItem("abstractSection", "guidelines")}
                onRemove={(index) => removeListItem("abstractSection", "guidelines", index)}
                placeholder="Enter a guideline"
              />
              <EditableStringList
                title="Focus topics"
                description="Topic list used for submission focus and program relevance."
                values={form.abstractSection.topics}
                onChange={(index, value) => handleListChange("abstractSection", "topics", index, value)}
                onAdd={() => addListItem("abstractSection", "topics")}
                onRemove={(index) => removeListItem("abstractSection", "topics", index)}
                placeholder="Enter a topic"
              />
              <EditableStringList
                title="Before submit"
                description="Checklist items shown before authors submit."
                values={form.abstractSection.beforeSubmit}
                onChange={(index, value) => handleListChange("abstractSection", "beforeSubmit", index, value)}
                onAdd={() => addListItem("abstractSection", "beforeSubmit")}
                onRemove={(index) => removeListItem("abstractSection", "beforeSubmit", index)}
                placeholder="Enter a checklist item"
              />
              <EditableStringList
                title="Countries"
                description="Country options used in the abstract form."
                values={form.abstractSection.countries}
                onChange={(index, value) => handleListChange("abstractSection", "countries", index, value)}
                onAdd={() => addListItem("abstractSection", "countries")}
                onRemove={(index) => removeListItem("abstractSection", "countries", index)}
                placeholder="Enter a country"
              />
              <EditableStringList
                title="Presentation types"
                description="Presentation type options used in the form."
                values={form.abstractSection.presentationTypes}
                onChange={(index, value) => handleListChange("abstractSection", "presentationTypes", index, value)}
                onAdd={() => addListItem("abstractSection", "presentationTypes")}
                onRemove={(index) => removeListItem("abstractSection", "presentationTypes", index)}
                placeholder="Enter a presentation type"
              />
              <EditableStringList
                title="Author titles"
                description="Title options shown at the top of the form."
                values={form.abstractSection.authorTitles}
                onChange={(index, value) => handleListChange("abstractSection", "authorTitles", index, value)}
                onAdd={() => addListItem("abstractSection", "authorTitles")}
                onRemove={(index) => removeListItem("abstractSection", "authorTitles", index)}
                placeholder="Enter an author title"
              />
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
              disabled={mutation.isPending || isUploadingAsset}
              className="inline-flex rounded-full bg-[#241133] px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(36,17,51,0.2)] transition hover:-translate-y-0.5 hover:bg-[#34154b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isUploadingAsset ? "Uploading..." : mutation.isPending ? "Saving..." : "Save content"}
            </button>
          </div>
        </form>
      </motion.section>

      <AnimatePresence>
        {isSessionModalOpen ? (
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
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/50 bg-white/92 p-6 shadow-[0_35px_90px_rgba(7,11,22,0.2)] dark:border-white/10 dark:bg-[#0d1528]/95"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
                {editingSessionIndex === null ? "Add session" : "Edit session"}
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold">
                {editingSessionIndex === null ? "Create a new session card" : "Update session content"}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                The same session data will power the public sessions page and the homepage preview.
              </p>

              <form onSubmit={handleSessionSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
                <input value={draftSession.title} onChange={(event) => setDraftSession((current) => ({ ...current, title: event.target.value }))} placeholder="Session title" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />
                <textarea value={draftSession.description} onChange={(event) => setDraftSession((current) => ({ ...current, description: event.target.value }))} placeholder="Session description" rows="4" className="w-full rounded-[1.2rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />
                <S3UploadField
                  label="Session cover image"
                  value={draftSession.image}
                  onChange={(value) => setDraftSession((current) => ({ ...current, image: value }))}
                  category="banners"
                  placeholder="Paste an image URL or upload a session cover image"
                  className="lg:col-span-2"
                  onUploadStateChange={setIsUploadingAsset}
                  required
                />
                <input value={draftSession.format} onChange={(event) => setDraftSession((current) => ({ ...current, format: event.target.value }))} placeholder="Format" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
                <input value={draftSession.track} onChange={(event) => setDraftSession((current) => ({ ...current, track: event.target.value }))} placeholder="Track" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
                <select value={draftSession.day} onChange={(event) => setDraftSession((current) => ({ ...current, day: event.target.value }))} className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]">
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <input value={draftSession.actionTo} onChange={(event) => setDraftSession((current) => ({ ...current, actionTo: event.target.value }))} placeholder="Action link" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff]" />
                <input value={draftSession.actionLabel} onChange={(event) => setDraftSession((current) => ({ ...current, actionLabel: event.target.value }))} placeholder="Action label" className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] lg:col-span-2" />

                <div className="flex justify-end gap-3 lg:col-span-2">
                  <button type="button" onClick={() => setIsSessionModalOpen(false)} className="inline-flex rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]">Cancel</button>
                  <button type="submit" disabled={isUploadingAsset} className="inline-flex rounded-full bg-[#241133] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(36,17,51,0.2)] transition hover:-translate-y-0.5 hover:bg-[#34154b] disabled:cursor-not-allowed disabled:opacity-70">
                    {isUploadingAsset ? "Uploading..." : editingSessionIndex === null ? "Add session" : "Save session"}
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
