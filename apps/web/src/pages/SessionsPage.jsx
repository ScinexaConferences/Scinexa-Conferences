import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { SectionHeading } from "../components/SectionHeading";
import { defaultContentSettings } from "../data/contentDefaults";
import { getContentSettings } from "../services/siteSettingsService";

export function SessionsPage() {
  const { data: contentSettings } = useQuery({
    queryKey: ["content-settings"],
    queryFn: getContentSettings,
    initialData: defaultContentSettings,
    staleTime: 30000
  });
  const sessionsContent = contentSettings?.sessions ?? defaultContentSettings.sessions;
  const dayFilters = useMemo(
    () => ["All Tracks", ...Array.from(new Set((sessionsContent.sessions ?? []).map((session) => session.day)))],
    [sessionsContent.sessions]
  );
  const [selectedDay, setSelectedDay] = useState("All Tracks");

  const filteredSessions = useMemo(
    () =>
      (sessionsContent.sessions ?? []).filter((session) => selectedDay === "All Tracks" || session.day === selectedDay),
    [selectedDay, sessionsContent.sessions]
  );

  return (
    <section className="section-gap pt-8 sm:pt-10">
      <div className="page-shell">
        <div className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(245,241,255,0.96)_45%,rgba(235,243,255,0.92))] p-5 shadow-[0_28px_80px_rgba(16,24,54,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03)_50%,rgba(62,92,176,0.08))] sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_240px] lg:items-center">
            <div>
              <SectionHeading
                eyebrow={sessionsContent.eyebrow}
                title={sessionsContent.title}
                description={sessionsContent.description}
              />

              <div className="mt-8 rounded-full border border-white/60 bg-white/75 p-2 shadow-[0_18px_44px_rgba(69,61,158,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/[0.05]">
                <div className="flex flex-wrap gap-2">
                  {dayFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedDay(filter)}
                      className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                        selectedDay === filter
                          ? "bg-gradient-to-r from-[#6234ff] to-[#6d68ff] text-white shadow-[0_12px_30px_rgba(98,52,255,0.25)]"
                          : "bg-white text-[#4b3f83] hover:bg-[#f1edff] dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(180deg,#7c6cff,#6e5ef0_50%,#6ca6ff)] p-5 shadow-[0_24px_60px_rgba(94,86,240,0.22)]">
              <div className="rounded-[1.5rem] bg-[#241133] px-5 py-5 text-center text-white shadow-[0_18px_40px_rgba(36,17,51,0.28)]">
                <p className="text-2xl font-bold">{sessionsContent.ctaTitle}</p>
                <p className="mt-2 text-sm text-slate-200">{sessionsContent.ctaDescription}</p>
                <Link
                  to={sessionsContent.ctaTo}
                  className="mt-5 inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white"
                >
                  {sessionsContent.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredSessions.map((session, index) => (
            <motion.article
              key={session.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.04 }}
              className="overflow-hidden rounded-[2rem] border border-[#dce4ff] bg-white shadow-[0_20px_60px_rgba(14,24,54,0.1)] dark:border-white/10 dark:bg-white/[0.05]"
            >
              <img src={session.image} alt={session.title} className="h-48 w-full object-cover" />
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#d7ccff] bg-[#f6f2ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#40337a]">
                    {session.format}
                  </span>
                  <span className="rounded-full border border-[#d7ccff] bg-[#f6f2ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#40337a]">
                    {session.track}
                  </span>
                </div>

                <h2 className="mt-5 font-display text-[2rem] font-bold leading-tight text-[#1f2558] dark:text-white">
                  {session.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{session.description}</p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7f73bb]">{session.day}</span>
                  <Link
                    to={session.actionTo}
                    className="inline-flex rounded-full bg-gradient-to-r from-[#5115d8] via-[#6f1dff] to-[#5a8cff] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(96,43,214,0.24)] transition hover:-translate-y-0.5"
                  >
                    {session.actionLabel}
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
