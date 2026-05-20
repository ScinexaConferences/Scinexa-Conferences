import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { defaultHomeHeroSettings } from "../../data/homeHeroDefaults";
import { getHomeHeroSettings, updateHomeHeroSettings } from "../../services/siteSettingsService";
import { getAuthErrorMessage } from "../../utils/auth";
import { StatusToast } from "../modals/StatusToast";

function toDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  return value.slice(0, 16);
}

function normalizePayload(form) {
  return {
    ...form,
    countdownTarget: form.countdownTarget,
    resources: form.resources.map((resource) => ({
      title: resource.title.trim(),
      subtitle: resource.subtitle.trim(),
      image: resource.image.trim(),
      to: resource.to.trim(),
      action: resource.action.trim()
    }))
  };
}

export function HomeHeroSettingsForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(defaultHomeHeroSettings);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["home-hero-settings"],
    queryFn: getHomeHeroSettings,
    initialData: defaultHomeHeroSettings,
    staleTime: 30000
  });

  useEffect(() => {
    setForm({
      ...defaultHomeHeroSettings,
      ...data,
      resources: Array.isArray(data?.resources) && data.resources.length
        ? data.resources.map((resource) => ({ ...resource }))
        : defaultHomeHeroSettings.resources.map((resource) => ({ ...resource }))
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
    mutationFn: (payload) => updateHomeHeroSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["home-hero-settings"], updated);
      setToast("Homepage hero updated successfully.");
      setError("");
    },
    onError: (requestError) => {
      setError(getAuthErrorMessage(requestError));
    }
  });

  const detailFields = useMemo(
    () => [
      { key: "dateText", label: "Date" },
      { key: "locationText", label: "Location" },
      { key: "delegatesText", label: "Delegates" },
      { key: "venueText", label: "Venue" }
    ],
    []
  );

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleResourceChange = (index, field, value) => {
    setForm((current) => ({
      ...current,
      resources: current.resources.map((resource, resourceIndex) =>
        resourceIndex === index ? { ...resource, [field]: value } : resource
      )
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Homepage hero</p>
        <h3 className="mt-3 font-display text-3xl font-bold">Manage home conference spotlight</h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Control the countdown target, headline, venue details, CTA buttons, and the four hero resource cards shown on
          the public homepage.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="grid gap-5 xl:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold">Eyebrow</span>
              <input
                type="text"
                name="eyebrow"
                value={form.eyebrow}
                onChange={handleFieldChange}
                className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold">Countdown target</span>
              <input
                type="datetime-local"
                name="countdownTarget"
                value={toDateTimeLocal(form.countdownTarget)}
                onChange={handleFieldChange}
                className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                required
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold">Title</span>
            <textarea
              name="title"
              value={form.title}
              onChange={handleFieldChange}
              rows={3}
              className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFieldChange}
              rows={4}
              className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
              required
            />
          </label>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Conference detail cards
            </p>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {detailFields.map((field) => (
                <label key={field.key} className="block space-y-2">
                  <span className="text-sm font-semibold">{field.label}</span>
                  <input
                    type="text"
                    name={field.key}
                    value={form[field.key]}
                    onChange={handleFieldChange}
                    className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              CTA buttons
            </p>
            <div className="mt-4 grid gap-5 xl:grid-cols-2">
              <div className="rounded-[1.6rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-sm font-semibold">Primary CTA</p>
                <div className="mt-4 grid gap-4">
                  <input
                    type="text"
                    name="primaryCtaLabel"
                    value={form.primaryCtaLabel}
                    onChange={handleFieldChange}
                    placeholder="Button label"
                    className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                  <input
                    type="text"
                    name="primaryCtaTo"
                    value={form.primaryCtaTo}
                    onChange={handleFieldChange}
                    placeholder="/registration"
                    className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-sm font-semibold">Secondary CTA</p>
                <div className="mt-4 grid gap-4">
                  <input
                    type="text"
                    name="secondaryCtaLabel"
                    value={form.secondaryCtaLabel}
                    onChange={handleFieldChange}
                    placeholder="Button label"
                    className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                  <input
                    type="text"
                    name="secondaryCtaTo"
                    value={form.secondaryCtaTo}
                    onChange={handleFieldChange}
                    placeholder="#downloads or /page"
                    className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Hero resource cards
            </p>
            <div className="mt-4 grid gap-5 xl:grid-cols-2">
              {form.resources.map((resource, index) => (
                <div
                  key={`${resource.title}-${index}`}
                  className="rounded-[1.6rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <p className="text-sm font-semibold">Card {index + 1}</p>
                  <div className="mt-4 grid gap-4">
                    <input
                      type="text"
                      value={resource.title}
                      onChange={(event) => handleResourceChange(index, "title", event.target.value)}
                      placeholder="Title"
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                    <textarea
                      value={resource.subtitle}
                      onChange={(event) => handleResourceChange(index, "subtitle", event.target.value)}
                      placeholder="Subtitle"
                      rows={3}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                    <input
                      type="text"
                      value={resource.image}
                      onChange={(event) => handleResourceChange(index, "image", event.target.value)}
                      placeholder="Image URL"
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        value={resource.to}
                        onChange={(event) => handleResourceChange(index, "to", event.target.value)}
                        placeholder="/registration"
                        className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                        required
                      />
                      <input
                        type="text"
                        value={resource.action}
                        onChange={(event) => handleResourceChange(index, "action", event.target.value)}
                        placeholder="Open"
                        className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error ? (
            <div className="rounded-[1.25rem] border border-[#f0c4cb] bg-[#fff2f4] px-4 py-3 text-sm font-medium text-[#99283f]">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              Changes publish to the public homepage through the shared site settings API.
            </p>
            <button
              type="submit"
              disabled={mutation.isPending || isLoading}
              className="inline-flex min-w-[12rem] items-center justify-center rounded-full bg-gradient-to-r from-[#4f46ff] via-[#663dff] to-[#2fb6ff] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_20px_40px_rgba(79,70,255,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mutation.isPending ? "Saving..." : "Save Hero Settings"}
            </button>
          </div>
        </form>
      </motion.section>
    </>
  );
}
