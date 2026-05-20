import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SectionHeading } from "../components/SectionHeading";
import { defaultHomeHeroSettings } from "../data/homeHeroDefaults";
import { getHomeHeroSettings } from "../services/siteSettingsService";

export function AboutPage() {
  const { data: heroSettings } = useQuery({
    queryKey: ["home-hero-settings"],
    queryFn: getHomeHeroSettings,
    initialData: defaultHomeHeroSettings,
    staleTime: 30000
  });

  return (
    <section className="section-gap">
      <div className="page-shell">
        <div className="grid items-start gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -left-6 top-10 hidden h-40 w-40 rounded-full bg-[#76d6ff]/20 blur-3xl lg:block" />
            <div className="absolute -bottom-8 right-2 hidden h-44 w-44 rounded-full bg-[#7f46ff]/18 blur-3xl lg:block" />

            <div className="relative overflow-hidden rounded-[2.3rem] border border-black/5 bg-[#0b0818] shadow-[0_30px_80px_rgba(15,21,55,0.18)] dark:border-white/10">
              <img
                src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=1200&q=80"
                alt="Laboratory research and scientific collaboration visual"
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,24,0.08),rgba(10,8,24,0.2)_55%,rgba(10,8,24,0.88))]" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                <div className="max-w-xs rounded-[1.6rem] border border-white/12 bg-white/10 p-4 text-white backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8d8ff]">Host City</p>
                  <p className="mt-2 font-display text-2xl font-bold">{heroSettings.locationText}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{heroSettings.dateText}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <SectionHeading
              eyebrow="About This Conference"
              title="A sharper scientific meeting experience built for serious collaboration"
              description="Inspired by premium congress layouts, this section frames the event as more than a registration page. It presents the conference as a destination for research exchange, practical insight, and long-tail professional relationships."
            />

            <div className="mt-8 space-y-6 text-base leading-8 text-slate-600 dark:text-slate-300">
              <p>
                {heroSettings.title} is designed to bring together clinicians, microbiologists, infectious disease
                specialists, and translational researchers in a setting that feels focused, credible, and globally
                connected.
              </p>
              <p>
                Across the program, delegates can move between keynote thinking, evidence-led breakout sessions,
                sponsor interaction, and peer conversations that carry useful ideas back into hospitals, laboratories,
                universities, and public health teams.
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/registration"
                className="inline-flex items-center justify-center rounded-full bg-[#261038] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_34px_rgba(38,16,56,0.18)] transition hover:-translate-y-0.5 hover:bg-[#35124d]"
              >
                Register Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
