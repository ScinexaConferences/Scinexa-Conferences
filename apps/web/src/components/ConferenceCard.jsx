import { Link } from "react-router-dom";
import { formatDateRange, getDaysUntil } from "../utils/date";

export function ConferenceCard({ conference }) {
  return (
    <article className="glass-panel overflow-hidden rounded-[2rem] shadow-soft">
      <img src={conference.image} alt={conference.title} className="h-56 w-full object-cover" />
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-glacier px-3 py-1 text-xs font-semibold text-ink">
            {conference.category}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-300">
            {getDaysUntil(conference.startDate)} days left
          </span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold">{conference.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{conference.blurb}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-500 dark:text-slate-300">
          <div>{conference.city}</div>
          <div className="text-right">{formatDateRange(conference.startDate, conference.endDate)}</div>
          <div>{conference.speakers} speakers</div>
          <div className="text-right">From ${conference.priceFrom}</div>
        </div>
        <Link
          to={`/conferences/${conference.id}`}
          className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-ink"
        >
          View conference
        </Link>
      </div>
    </article>
  );
}

