import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SpeakerCard } from "../components/SpeakerCard";
import { SectionHeading } from "../components/SectionHeading";
import { defaultSpeakersSettings } from "../data/speakersDefaults";
import { getSpeakersSettings } from "../services/siteSettingsService";

export function SpeakersPage() {
  const { data } = useQuery({
    queryKey: ["speakers-settings"],
    queryFn: getSpeakersSettings,
    initialData: defaultSpeakersSettings,
    staleTime: 30000
  });
  const speakers = data?.speakers?.length ? data.speakers : defaultSpeakersSettings.speakers;
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(speakers.map((speaker) => speaker.category).filter(Boolean)))],
    [speakers]
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredSpeakers =
    activeCategory === "All" ? speakers : speakers.filter((speaker) => speaker.category === activeCategory);

  return (
    <section className="section-gap pt-8 sm:pt-10">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Speaker network"
          title="Meet the clinicians, researchers, and scientific voices shaping the program"
          description="Browse speaker cards by contribution type and discover the experts leading keynotes, poster conversations, virtual sessions, and delegate-facing program moments."
        />

        <div className="mt-8 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-[1.8rem] border border-[#dce8ff] bg-white/92 px-4 py-4 shadow-[0_16px_38px_rgba(15,24,58,0.08)] dark:border-white/10 dark:bg-white/[0.04]">
            {categories.map((category) => {
              const isActive = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-[#5f2cff] to-[#7247ff] text-white shadow-[0_14px_30px_rgba(90,50,255,0.24)]"
                      : "border border-[#ddd7ff] bg-white text-[#2c2557] hover:bg-[#f6f2ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredSpeakers.map((speaker, index) => (
            <motion.div
              key={speaker.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: Math.min(index * 0.04, 0.28) }}
            >
            <SpeakerCard key={speaker.name} speaker={speaker} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
