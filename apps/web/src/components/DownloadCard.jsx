import { Link } from "react-router-dom";

export function DownloadCard({ resource }) {
  return (
    <article className="overflow-hidden rounded-[1.8rem] border border-[#d8e4ff] bg-white shadow-[0_22px_48px_rgba(17,24,58,0.1)] dark:border-white/10 dark:bg-white/[0.04]">
      <img src={resource.image} alt={resource.title} className="h-44 w-full object-cover" />
      <div className="p-5">
        <h3 className="font-display text-[2rem] font-bold leading-tight text-[#22344a] dark:text-white">{resource.title}</h3>
        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{resource.description}</p>
        <Link
          to={resource.actionTo}
          className="mt-6 inline-flex w-full items-center justify-center rounded-[1.2rem] border border-[#e1cfff] px-5 py-4 text-base font-semibold text-[#352055] transition hover:bg-[#faf6ff] dark:border-white/10 dark:text-white dark:hover:bg-white/[0.05]"
        >
          {resource.actionLabel}
        </Link>
      </div>
    </article>
  );
}
