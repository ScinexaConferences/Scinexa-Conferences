import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { conferences, faqs, testimonials } from "../data/mockData";
import { ConferenceCard } from "../components/ConferenceCard";
import { FaqList } from "../components/FaqList";
import { NewsletterCard } from "../components/NewsletterCard";
import { SectionHeading } from "../components/SectionHeading";
import { CommitteeCard } from "../components/CommitteeCard";
import { DownloadCard } from "../components/DownloadCard";
import { SpeakerCard } from "../components/SpeakerCard";
import { defaultAgendaSettings } from "../data/agendaDefaults";
import { defaultCommitteeSettings } from "../data/committeeDefaults";
import { defaultDownloadsSettings } from "../data/downloadsDefaults";
import { defaultHomeHeroSettings } from "../data/homeHeroDefaults";
import { defaultSpeakersSettings } from "../data/speakersDefaults";
import { getAgendaSettings, getCommitteeSettings, getDownloadsSettings, getHomeHeroSettings, getSpeakersSettings } from "../services/siteSettingsService";

const abstractHighlights = [
  "Peer review-ready submission flow with topic tagging and author metadata.",
  "Rapid review coordination for oral, poster, and workshop formats.",
  "Automated communication touchpoints for decisions, revisions, and final uploads."
];

function getCountdownParts(targetDate) {
  const target = new Date(targetDate).getTime();

  if (Number.isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const distance = Math.max(target - Date.now(), 0);

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };
}

function HeroAction({ to, className, children }) {
  if (to?.startsWith("#")) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export function HomePage() {
  const { data: heroSettings } = useQuery({
    queryKey: ["home-hero-settings"],
    queryFn: getHomeHeroSettings,
    initialData: defaultHomeHeroSettings,
    staleTime: 30000
  });
  const { data: agendaSettings } = useQuery({
    queryKey: ["agenda-settings"],
    queryFn: getAgendaSettings,
    initialData: defaultAgendaSettings,
    staleTime: 30000
  });
  const { data: speakersSettings } = useQuery({
    queryKey: ["speakers-settings"],
    queryFn: getSpeakersSettings,
    initialData: defaultSpeakersSettings,
    staleTime: 30000
  });
  const { data: committeeSettings } = useQuery({
    queryKey: ["committee-settings"],
    queryFn: getCommitteeSettings,
    initialData: defaultCommitteeSettings,
    staleTime: 30000
  });
  const { data: downloadsSettings } = useQuery({
    queryKey: ["downloads-settings"],
    queryFn: getDownloadsSettings,
    initialData: defaultDownloadsSettings,
    staleTime: 30000
  });
  const [countdown, setCountdown] = useState(() => getCountdownParts(defaultHomeHeroSettings.countdownTarget));
  const homepageAgendaDay = agendaSettings?.days?.[0] ?? defaultAgendaSettings.days[0];
  const homepageSpeakers = (speakersSettings?.speakers?.length ? speakersSettings.speakers : defaultSpeakersSettings.speakers).slice(0, 3);
  const homepageCommittee = (committeeSettings?.members?.length ? committeeSettings.members : defaultCommitteeSettings.members).slice(0, 3);
  const homepageDownloads = (downloadsSettings?.resources?.length ? downloadsSettings.resources : defaultDownloadsSettings.resources).slice(0, 3);

  useEffect(() => {
    setCountdown(getCountdownParts(heroSettings.countdownTarget));

    const intervalId = window.setInterval(() => {
      setCountdown(getCountdownParts(heroSettings.countdownTarget));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [heroSettings.countdownTarget]);

  return (
    <>
      <section className="section-gap pb-10 pt-8 sm:pt-10">
        <div className="page-shell">
          <div className="relative overflow-hidden rounded-[2.75rem] bg-[#070b22] px-6 py-8 text-white shadow-[0_32px_90px_rgba(18,22,63,0.26)] sm:px-10 lg:px-14 lg:py-14">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(67,116,255,0.35),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(176,79,255,0.28),_transparent_30%),linear-gradient(110deg,_rgba(7,11,34,0.92),_rgba(16,15,49,0.88))]" />
            <div className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-[#1f73ff]/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#8d35ff]/20 blur-3xl" />

            <div className="relative grid items-start gap-12 lg:grid-cols-[1.02fr_0.98fr]">
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
              >
                <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#93b7ff]">
                  {heroSettings.eyebrow}
                </div>
                <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.02] sm:text-5xl xl:text-[4.35rem]">
                  {heroSettings.title}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                  {heroSettings.description}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:max-w-3xl">
                  <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7cd5ff]">Date</p>
                    <p className="mt-2 text-lg font-semibold">{heroSettings.dateText}</p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7cd5ff]">Location</p>
                    <p className="mt-2 text-lg font-semibold">{heroSettings.locationText}</p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#ffd86f]">Delegates</p>
                    <p className="mt-2 text-lg font-semibold">{heroSettings.delegatesText}</p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#d48cff]">Venue</p>
                    <p className="mt-2 text-lg font-semibold">{heroSettings.venueText}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <HeroAction
                    to={heroSettings.primaryCtaTo}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#5e2cff] to-[#7c49ff] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_34px_rgba(90,50,255,0.35)]"
                  >
                    {heroSettings.primaryCtaLabel}
                  </HeroAction>
                  <HeroAction
                    to={heroSettings.secondaryCtaTo}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/14"
                  >
                    {heroSettings.secondaryCtaLabel}
                  </HeroAction>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-4 xl:max-w-3xl">
                  {[
                    { label: "Days", value: countdown.days },
                    { label: "Hours", value: countdown.hours },
                    { label: "Minutes", value: countdown.minutes },
                    { label: "Seconds", value: countdown.seconds }
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.65rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(112,89,255,0.16))] px-4 py-5 text-center backdrop-blur"
                    >
                      <p className="font-display text-4xl font-bold sm:text-[2.65rem]">
                        {String(item.value).padStart(2, "0")}
                      </p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.32em] text-slate-300">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative"
              >
                <div className="absolute -left-4 top-1/2 hidden -translate-y-1/2 xl:block">
                  <div className="rounded-[1.8rem] border border-[#4f86ff]/25 bg-[#070b1f]/90 p-4 shadow-[0_20px_60px_rgba(12,17,44,0.55)] backdrop-blur">
                    <p className="text-sm font-semibold text-white">Register Now</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.26em] text-[#8fb6ff]">Safe and secure checkout</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {heroSettings.resources.map((item) => (
                    <article
                      key={item.title}
                      className="overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.08))] shadow-[0_24px_60px_rgba(8,12,38,0.38)] backdrop-blur"
                    >
                      <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
                      <div className="p-5">
                        <p className="font-display text-2xl font-bold leading-tight">{item.title}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-200">{item.subtitle}</p>
                        <HeroAction
                          to={item.to}
                          className="mt-5 inline-flex rounded-full border border-[#5dc7ff]/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8ed9ff]"
                        >
                          {item.action}
                        </HeroAction>
                      </div>
                    </article>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-gap scroll-mt-32">
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
                  to="/about"
                  className="inline-flex items-center justify-center rounded-full bg-[#261038] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_34px_rgba(38,16,56,0.18)] transition hover:-translate-y-0.5 hover:bg-[#35124d]"
                >
                  Read More About
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="sessions" className="section-gap scroll-mt-32">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Sessions"
            title="Featured conferences with sharper visual hierarchy"
            description="These cards stay connected to your existing routes while the homepage now sets a much stronger conference-first tone."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {conferences.map((conference) => (
              <ConferenceCard key={conference.id} conference={conference} />
            ))}
          </div>
        </div>
      </section>

      <section id="abstract" className="section-gap scroll-mt-32">
        <div className="page-shell">
          <div className="overflow-hidden rounded-[2.4rem] bg-[linear-gradient(135deg,#161039,#3d1f7e_54%,#225ea8)] px-6 py-8 text-white shadow-[0_28px_70px_rgba(22,16,57,0.25)] sm:px-10 lg:px-12">
            <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#89d7ff]">Abstract</p>
                <h2 className="mt-4 font-display text-4xl font-bold leading-tight">
                  Abstract submission needs to feel credible, simple, and fast.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-100">
                  This section mirrors the scientific-event experience delegates expect: clear deadlines, visible review
                  pathways, and strong calls to action for authors and speakers.
                </p>
                <Link
                  to="/abstract"
                  className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#2d146c]"
                >
                  Start Submission
                </Link>
              </div>

              <div className="grid gap-4">
                {abstractHighlights.map((item) => (
                  <article key={item} className="rounded-[1.7rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <p className="text-base leading-7 text-slate-100">{item}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="agenda" className="section-gap scroll-mt-32">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Agenda"
            title="Program moments designed for keynotes, peer exchange, and practical takeaways"
            description="A live preview of the current agenda is surfaced here so delegates can immediately see the pacing and quality of the scientific program."
          />
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="inline-flex rounded-full border border-[#d9d2ff] bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#5b34d9] shadow-[0_10px_24px_rgba(18,26,52,0.06)] dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
              {homepageAgendaDay.label}
            </div>
            <Link
              to="/agenda"
              className="inline-flex rounded-full bg-[#23124f] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(35,18,79,0.18)]"
            >
              View full agenda
            </Link>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {homepageAgendaDay.items.slice(0, 3).map((item) => (
              <article key={item.time + item.title} className="glass-panel rounded-[1.9rem] p-6 shadow-soft">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6639ff] dark:text-[#aa9bff]">
                  {item.time}
                </p>
                <h3 className="mt-4 font-display text-2xl font-bold">{item.title}</h3>
                <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{item.lead}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{item.room}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="speakers" className="section-gap scroll-mt-32">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Speakers"
            title="Thoughtful profiles for delegates, authors, and organizers"
            description="The homepage keeps the speaker showcase, but the surrounding design now frames it like a conference destination instead of a generic product landing page."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {homepageSpeakers.map((speaker) => (
              <SpeakerCard key={speaker.name} speaker={speaker} />
            ))}
          </div>
        </div>
      </section>

      <section id="committee" className="section-gap scroll-mt-32">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Committee"
            title="Committee leadership that reinforces trust and scientific governance"
            description="The committee layer now leads to a full dedicated page while keeping a strong leadership preview here on the homepage."
          />
          <div className="mt-6 flex justify-end">
            <Link
              to="/committee"
              className="inline-flex rounded-full bg-[#23124f] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(35,18,79,0.18)]"
            >
              View full committee
            </Link>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {homepageCommittee.map((member) => (
              <CommitteeCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section id="downloads" className="section-gap scroll-mt-32">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Downloads"
            title="A cleaner resource hub for brochures, schedules, and templates"
            description="The downloads layer now leads to a dedicated page while keeping a strong resource preview available directly from the homepage."
          />
          <div className="mt-6 flex justify-end">
            <Link
              to="/downloads"
              className="inline-flex rounded-full bg-[#23124f] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(35,18,79,0.18)]"
            >
              View full downloads
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {homepageDownloads.map((resource) => (
              <DownloadCard key={resource.title} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      <section id="venue" className="section-gap scroll-mt-32">
        <div className="page-shell grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="overflow-hidden rounded-[2.15rem] bg-[linear-gradient(135deg,#13103a,#28175f_56%,#5e31cb)] p-8 text-white shadow-[0_24px_64px_rgba(28,17,76,0.24)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9cdeff]">Venue</p>
            <h2 className="mt-4 font-display text-4xl font-bold">Singapore Expo Convention Centre</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-100">
              A polished waterfront setting designed for plenary sessions, abstract presentations, sponsor showcases,
              and high-volume delegate movement across three event days.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#a9e2ff]">Address</p>
                <p className="mt-3 text-sm leading-6 text-slate-100">1 Expo Drive, Marina District, Singapore</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#a9e2ff]">Access</p>
                <p className="mt-3 text-sm leading-6 text-slate-100">Direct metro links, hotel shuttles, and airport connectivity</p>
              </div>
            </div>
          </article>

          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <article
                id="terms"
                className="glass-panel scroll-mt-32 rounded-[1.85rem] p-6 shadow-soft"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6639ff] dark:text-[#aa9bff]">
                  Terms &amp; Conditions
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Registration terms, refund policy windows, transfer eligibility, and event participation rules can be surfaced here.
                </p>
              </article>
              <article
                id="privacy"
                className="glass-panel scroll-mt-32 rounded-[1.85rem] p-6 shadow-soft"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6639ff] dark:text-[#aa9bff]">
                  Privacy Policy
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Delegate data handling, abstract submission privacy, and sponsor communication preferences can be summarized here.
                </p>
              </article>
            </div>

            <article className="glass-panel rounded-[1.85rem] p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6639ff] dark:text-[#aa9bff]">
                More Destinations
              </p>
              <h3 className="mt-4 font-display text-2xl font-bold">Sponsors, journal, and contact are grouped under More.</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                This keeps the main navigation clean while still exposing the extra conference content shown in your reference menu.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/sponsors"
                  className="rounded-full bg-[#21134d] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white dark:bg-white dark:text-[#21134d]"
                >
                  Sponsors
                </Link>
                <Link
                  to="/blog"
                  className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] dark:border-white/10"
                >
                  Journal
                </Link>
                <Link
                  to="/contact"
                  className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] dark:border-white/10"
                >
                  Contact
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="faqs" className="section-gap scroll-mt-32">
        <div className="page-shell grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {testimonials.map((item) => (
              <article key={item.author} className="glass-panel rounded-[1.75rem] p-6">
                <p className="text-base leading-7 text-slate-700 dark:text-slate-200">"{item.quote}"</p>
                <p className="mt-6 text-sm font-semibold text-coral">{item.author}</p>
              </article>
            ))}
          </div>
          <div>
            <SectionHeading
              eyebrow="FAQs"
              title="The More menu now points to a dedicated FAQ destination"
              description="This keeps the dropdown true to your screenshot while still fitting the upgraded conference identity across the page."
            />
            <div className="mt-8">
              <FaqList items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <NewsletterCard />
    </>
  );
}
