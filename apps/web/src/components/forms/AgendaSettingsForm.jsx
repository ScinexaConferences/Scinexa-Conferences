import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { defaultAgendaSettings } from "../../data/agendaDefaults";
import { getAgendaSettings, updateAgendaSettings } from "../../services/siteSettingsService";
import { getAuthErrorMessage } from "../../utils/auth";
import { StatusToast } from "../modals/StatusToast";

function cloneDefaults() {
  return {
    days: defaultAgendaSettings.days.map((day) => ({
      ...day,
      items: day.items.map((item) => ({ ...item }))
    }))
  };
}

function normalizePayload(form) {
  return {
    days: form.days.map((day) => ({
      id: day.id.trim(),
      label: day.label.trim(),
      items: day.items.map((item) => ({
        time: item.time.trim(),
        title: item.title.trim(),
        room: item.room.trim(),
        lead: item.lead.trim(),
        tag: item.tag.trim()
      }))
    }))
  };
}

function createEmptyAgendaItem() {
  return { time: "", title: "", room: "", lead: "", tag: "" };
}

function createDayId(label, index) {
  const normalized = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `day-${index + 1}`;
}

export function AgendaSettingsForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => cloneDefaults());
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isAddDayModalOpen, setIsAddDayModalOpen] = useState(false);
  const [newDayLabel, setNewDayLabel] = useState("");
  const [activeDayId, setActiveDayId] = useState(defaultAgendaSettings.days[0]?.id ?? "");

  const { data } = useQuery({
    queryKey: ["agenda-settings"],
    queryFn: getAgendaSettings,
    initialData: defaultAgendaSettings,
    staleTime: 30000
  });

  useEffect(() => {
    const nextDays = (data?.days?.length ? data.days : defaultAgendaSettings.days).map((day, dayIndex) => ({
        id: day.id || `day-${dayIndex + 1}`,
        label: day.label || `Day ${dayIndex + 1}`,
        items: Array.isArray(day.items) && day.items.length
          ? day.items.map((item) => ({ ...item }))
          : [{ time: "", title: "", room: "", lead: "", tag: "" }]
      }));

    setForm({ days: nextDays });
    setActiveDayId((current) => (nextDays.some((day) => day.id === current) ? current : (nextDays[0]?.id ?? "")));
  }, [data]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const mutation = useMutation({
    mutationFn: (payload) => updateAgendaSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["agenda-settings"], updated);
      setError("");
      setToast("Agenda updated successfully.");
    },
    onError: (requestError) => {
      setError(getAuthErrorMessage(requestError));
    }
  });

  const handleDayLabelChange = (dayIndex, value) => {
    const previousDayId = form.days[dayIndex]?.id;
    const nextDayId = createDayId(value, dayIndex);

    setForm((current) => ({
      ...current,
      days: current.days.map((day, index) =>
        index === dayIndex ? { ...day, label: value, id: nextDayId } : day
      )
    }));
    if (activeDayId === previousDayId) {
      setActiveDayId(nextDayId);
    }
    setError("");
  };

  const handleItemChange = (dayIndex, itemIndex, field, value) => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: day.items.map((item, currentItemIndex) =>
                currentItemIndex === itemIndex ? { ...item, [field]: value } : item
              )
            }
          : day
      )
    }));
    setError("");
  };

  const handleAddItem = (dayIndex) => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: [...day.items, createEmptyAgendaItem()]
            }
          : day
      )
    }));
    setError("");
  };

  const handleAddDay = (label) => {
    setForm((current) => {
      const nextIndex = current.days.length;
      const nextLabel = label?.trim() || `Day ${nextIndex + 1}`;
      const nextDayId = createDayId(nextLabel, nextIndex);

      return {
        ...current,
        days: [
          ...current.days,
          {
            id: nextDayId,
            label: nextLabel,
            items: [createEmptyAgendaItem()]
          }
        ]
      };
    });
    const nextIndex = form.days.length;
    const nextLabel = label?.trim() || `Day ${nextIndex + 1}`;
    setActiveDayId(createDayId(nextLabel, nextIndex));
    setError("");
  };

  const handleAddDaySubmit = (event) => {
    event.preventDefault();
    handleAddDay(newDayLabel);
    setNewDayLabel("");
    setIsAddDayModalOpen(false);
  };

  const handleRemoveDay = (dayIndex) => {
    const removedDayId = form.days[dayIndex]?.id;
    const fallbackDayId =
      form.days[dayIndex + 1]?.id ??
      form.days[dayIndex - 1]?.id ??
      form.days[0]?.id ??
      "";

    setForm((current) => ({
      ...current,
      days: current.days.length > 1 ? current.days.filter((_, index) => index !== dayIndex) : current.days
    }));
    if (removedDayId === activeDayId && form.days.length > 1) {
      setActiveDayId(fallbackDayId);
    }
    setError("");
  };

  const handleRemoveItem = (dayIndex, itemIndex) => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: day.items.length > 1 ? day.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex) : day.items
            }
          : day
      )
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const hasEmptyField = form.days.some((day) =>
      !day.label.trim() ||
      day.items.some(
        (item) =>
          !item.time.trim() ||
          !item.title.trim() ||
          !item.room.trim() ||
          !item.lead.trim() ||
          !item.tag.trim()
      )
    );

    if (hasEmptyField) {
      setError("Please complete every agenda field before saving.");
      return;
    }

    if (!form.days.length) {
      setError("Please keep at least one agenda day.");
      return;
    }

    await mutation.mutateAsync(normalizePayload(form));
  };

  const activeDayIndex = form.days.findIndex((day) => day.id === activeDayId);
  const activeDay = form.days[activeDayIndex] ?? form.days[0];
  const selectedDayIndex = activeDay ? form.days.findIndex((day) => day.id === activeDay.id) : -1;

  return (
    <>
      <StatusToast message={toast} />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="rounded-[2rem] border border-white/50 bg-white/78 p-6 shadow-[0_25px_70px_rgba(11,22,56,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] sm:p-7"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Agenda editor</p>
        <h3 className="mt-3 font-display text-3xl font-bold">Manage day tabs and agenda sessions</h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          These entries power the public agenda page and the agenda preview shown across the conference experience.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                Agenda days
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Add or remove day tabs before editing the sessions inside them.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setNewDayLabel(`Day ${form.days.length + 1}`);
                setIsAddDayModalOpen(true);
              }}
              className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-5 py-2.5 text-sm font-semibold text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            >
              Add day
            </button>
          </div>

          <div className="rounded-[1.6rem] border border-black/5 bg-white/70 p-4 shadow-[0_12px_30px_rgba(18,28,56,0.04)] dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                  Day navigator
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Edit one day at a time so large agendas stay easy to manage.
                </p>
              </div>

              <div className="rounded-full border border-[#ddd7ff] bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#5e2cff] dark:border-white/10 dark:bg-white/[0.05] dark:text-white">
                {form.days.length} days total
              </div>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {form.days.map((day) => {
                const isActive = day.id === activeDay?.id;

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setActiveDayId(day.id)}
                    className={`shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-gradient-to-r from-[#5f2cff] to-[#7247ff] text-white shadow-[0_14px_30px_rgba(90,50,255,0.24)]"
                        : "border border-[#ddd7ff] bg-white text-[#2c2557] hover:bg-[#f6f2ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeDay ? (
            <div
              key={activeDay.id}
              className="rounded-[1.8rem] border border-black/5 bg-black/[0.015] p-5 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="block w-full max-w-sm space-y-2">
                  <span className="text-sm font-semibold">Day label</span>
                  <input
                    type="text"
                    value={activeDay.label}
                    onChange={(event) => handleDayLabelChange(selectedDayIndex, event.target.value)}
                    className="w-full rounded-[1.15rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-full border border-[#ddd7ff] bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#5e2cff] dark:border-white/10 dark:bg-white/[0.05] dark:text-white">
                    {activeDay.items.length} sessions
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDay(selectedDayIndex)}
                    disabled={form.days.length === 1}
                    className="inline-flex rounded-full border border-[#f4ccd6] bg-[#fff1f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#991f3d] transition hover:bg-[#ffe7ef] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#7a2940] dark:bg-[#461224] dark:text-[#ffdbe5]"
                  >
                    Remove day
                  </button>
                </div>
              </div>

              {form.days.length === 1 ? (
                <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Keep at least one day tab in the agenda.
                </p>
              ) : null}

              <div className="mt-6 space-y-4">
                {activeDay.items.map((item, itemIndex) => (
                  <div
                    key={`${activeDay.id}-${itemIndex}`}
                    className="rounded-[1.5rem] border border-[#ddd7ff] bg-white/90 p-4 shadow-[0_12px_30px_rgba(18,28,56,0.06)] dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
                        Session {itemIndex + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(selectedDayIndex, itemIndex)}
                        className="inline-flex rounded-full border border-[#f4ccd6] bg-[#fff1f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#991f3d] transition hover:bg-[#ffe7ef] dark:border-[#7a2940] dark:bg-[#461224] dark:text-[#ffdbe5]"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[180px_1fr_220px]">
                      <label className="block space-y-2">
                        <span className="text-sm font-semibold">Time</span>
                        <input
                          type="text"
                          value={item.time}
                          onChange={(event) => handleItemChange(selectedDayIndex, itemIndex, "time", event.target.value)}
                          placeholder="08:00 AM"
                          className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                          required
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-sm font-semibold">Agenda name</span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(event) => handleItemChange(selectedDayIndex, itemIndex, "title", event.target.value)}
                          placeholder="Opening keynote"
                          className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                          required
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-sm font-semibold">Tag</span>
                        <input
                          type="text"
                          value={item.tag}
                          onChange={(event) => handleItemChange(selectedDayIndex, itemIndex, "tag", event.target.value)}
                          placeholder="Keynote"
                          className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                          required
                        />
                      </label>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-2">
                      <label className="block space-y-2">
                        <span className="text-sm font-semibold">Room</span>
                        <input
                          type="text"
                          value={item.room}
                          onChange={(event) => handleItemChange(selectedDayIndex, itemIndex, "room", event.target.value)}
                          placeholder="Grand Auditorium"
                          className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                          required
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-sm font-semibold">Lead / supporting line</span>
                        <input
                          type="text"
                          value={item.lead}
                          onChange={(event) => handleItemChange(selectedDayIndex, itemIndex, "lead", event.target.value)}
                          placeholder="Lead: Dr. Sarah Chen"
                          className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                          required
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleAddItem(selectedDayIndex)}
                className="mt-5 inline-flex rounded-full border border-[#ddd7ff] bg-white px-4 py-2.5 text-sm font-semibold text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
              >
                Add agenda item
              </button>
            </div>
          ) : null}

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
              {mutation.isPending ? "Saving..." : "Save agenda"}
            </button>
          </div>
        </form>
      </motion.section>

      <AnimatePresence>
        {isAddDayModalOpen ? (
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
              className="w-full max-w-lg rounded-[2rem] border border-white/50 bg-white/92 p-6 shadow-[0_35px_90px_rgba(7,11,22,0.2)] dark:border-white/10 dark:bg-[#0d1528]/95"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">Add day</p>
              <h3 className="mt-3 font-display text-3xl font-bold">Create a new agenda tab</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Set the day label first. You can add sessions for it right after the new tab appears.
              </p>

              <form onSubmit={handleAddDaySubmit} className="mt-6 space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold">Day label</span>
                  <input
                    type="text"
                    value={newDayLabel}
                    onChange={(event) => setNewDayLabel(event.target.value)}
                    className="w-full rounded-[1.15rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </label>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddDayModalOpen(false);
                      setNewDayLabel("");
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-[#241133] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(36,17,51,0.2)] transition hover:bg-[#34154b]"
                  >
                    Add day
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
