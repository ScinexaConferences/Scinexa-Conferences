import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { defaultAgendaSettings } from "../data/agendaDefaults";
import { getAgendaSettings } from "../services/siteSettingsService";

export function AgendaPage() {
  const { data } = useQuery({
    queryKey: ["agenda-settings"],
    queryFn: getAgendaSettings,
    initialData: defaultAgendaSettings,
    staleTime: 30000
  });
  const [activeDayId, setActiveDayId] = useState(defaultAgendaSettings.days[0]?.id ?? "");

  useEffect(() => {
    if (!data?.days?.length) {
      return;
    }

    const hasActiveDay = data.days.some((day) => day.id === activeDayId);
    if (!hasActiveDay) {
      setActiveDayId(data.days[0].id);
    }
  }, [activeDayId, data]);

  const days = data?.days?.length ? data.days : defaultAgendaSettings.days;
  const activeDay = days.find((day) => day.id === activeDayId) ?? days[0];

  return (
    <section className="section-gap pt-8 sm:pt-10">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[2rem] border border-[#d9e7ff] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,244,255,0.96))] p-4 shadow-[0_24px_70px_rgba(12,20,52,0.08)] dark:border-white/10 dark:bg-white/[0.05] sm:p-6"
        >
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-[#dfd8ff] bg-white/90 px-3 py-3 shadow-[0_10px_30px_rgba(19,24,56,0.06)] dark:border-white/10 dark:bg-white/[0.04]">
              {days.map((day) => {
                const isActive = day.id === activeDay?.id;

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setActiveDayId(day.id)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
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

          <div className="mt-6 space-y-3">
            {activeDay?.items?.map((item, index) => (
              <motion.article
                key={`${activeDay.id}-${item.time}-${item.title}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: index * 0.04 }}
                className="grid overflow-hidden rounded-[1.35rem] border border-[#d8e7ff] bg-white/95 shadow-[0_12px_30px_rgba(19,24,56,0.05)] dark:border-white/10 dark:bg-white/[0.04] md:grid-cols-[100px_1fr]"
              >
                <div className="flex items-center justify-center bg-[linear-gradient(180deg,#eaf8ff,#dff4ff)] px-4 py-6 text-center dark:bg-[linear-gradient(180deg,rgba(74,116,165,0.24),rgba(44,85,122,0.18))]">
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#3d59ff]">{item.time}</p>
                </div>

                <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl font-bold leading-tight text-[#241a54] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Room: {item.room}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.lead}</p>
                  </div>

                  <div className="shrink-0">
                    <span className="inline-flex rounded-full bg-[#eef9ff] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4676aa] dark:bg-[#153146] dark:text-[#b8e8ff]">
                      {item.tag}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
