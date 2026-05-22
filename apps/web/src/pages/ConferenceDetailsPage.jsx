import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { defaultAgendaSettings } from "../data/agendaDefaults";
import { defaultSpeakersSettings } from "../data/speakersDefaults";
import { conferences } from "../data/mockData";
import { getAgendaSettings, getSpeakersSettings } from "../services/siteSettingsService";
import { formatDateRange } from "../utils/date";

export function ConferenceDetailsPage() {
  const { conferenceId } = useParams();
  const conference = conferences.find((item) => item.id === conferenceId) ?? conferences[0];
  const { data: agendaSettings } = useQuery({
    queryKey: ["agenda-settings"],
    queryFn: getAgendaSettings,
    initialData: defaultAgendaSettings,
    staleTime: 30000
  });
  const { data: speakersSettings } = useQuery({
    queryKey: ["speakers-settings"],
    queryFn: getSpeakersSettings,
    staleTime: 30000
  });
  const agendaSnapshot = (agendaSettings?.days?.[0]?.items ?? defaultAgendaSettings.days[0].items).slice(0, 4);
  const featuredSpeakers = (Array.isArray(speakersSettings?.speakers) ? speakersSettings.speakers : []).slice(0, 3);

  return (
    <section className="section-gap">
      <div className="page-shell space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel overflow-hidden rounded-[2rem]">
            <img src={conference.image} alt={conference.title} className="h-80 w-full object-cover" />
            <div className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-coral">{conference.category}</p>
              <h1 className="mt-4 font-display text-4xl font-bold">{conference.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                {conference.blurb} This detail experience is built to hold venue content, speaker highlights, track information, countdowns, FAQs, and calls to register or submit abstracts.
              </p>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="glass-panel rounded-[1.75rem] p-6">
              <p className="text-sm text-slate-500 dark:text-slate-300">Date</p>
              <p className="mt-3 font-semibold">{formatDateRange(conference.startDate, conference.endDate)}</p>
              <p className="mt-5 text-sm text-slate-500 dark:text-slate-300">Venue</p>
              <p className="mt-3 font-semibold">{conference.venue}</p>
              <p className="text-sm text-slate-500 dark:text-slate-300">{conference.city}</p>
              <button type="button" className="mt-8 w-full rounded-full bg-ink px-5 py-3 font-semibold text-white dark:bg-white dark:text-ink">
                Book ticket
              </button>
            </div>
            <div className="glass-panel rounded-[1.75rem] p-6">
              <p className="font-semibold">Scientific tracks</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {conference.tracks.map((track) => (
                  <span key={track} className="rounded-full bg-glacier px-3 py-2 text-sm font-semibold text-ink">
                    {track}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="glass-panel rounded-[1.75rem] p-6">
            <h2 className="font-display text-2xl font-bold">Agenda snapshot</h2>
            <div className="mt-6 space-y-4">
              {agendaSnapshot.map((item) => (
                <div key={item.time + item.title} className="rounded-[1.25rem] border border-black/5 p-4 dark:border-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">{item.time}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-300">{item.tag}</p>
                  </div>
                  <p className="mt-2 font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{item.room}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{item.lead}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[1.75rem] p-6">
            <h2 className="font-display text-2xl font-bold">Featured speakers</h2>
            <div className="mt-6 space-y-4">
              {featuredSpeakers.map((speaker) => (
                <div key={speaker.name} className="flex gap-4 rounded-[1.25rem] border border-black/5 p-4 dark:border-white/10">
                  <img src={speaker.image} alt={speaker.name} className="h-16 w-16 rounded-2xl object-cover" />
                  <div>
                    <p className="font-semibold">{speaker.name}</p>
                    <p className="text-sm text-coral">{speaker.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{speaker.organization}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
