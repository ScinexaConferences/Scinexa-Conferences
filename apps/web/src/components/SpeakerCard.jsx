export function SpeakerCard({ speaker }) {
  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-[#4657d9]/25 bg-[linear-gradient(180deg,#f8fbff,#eef3ff)] shadow-[0_18px_44px_rgba(17,26,58,0.12)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(98,76,196,0.12))]">
      <img
        src={speaker.image ?? speaker.avatar}
        alt={speaker.name}
        className="h-64 w-full object-cover"
      />
      <div className="bg-[linear-gradient(180deg,#111736,#151d49)] p-5 text-white">
        <h3 className="font-display text-[1.35rem] font-bold leading-tight">{speaker.name}</h3>
        <p className="mt-2 text-sm font-semibold text-[#8ec8ff]">{speaker.title}</p>
        <p className="mt-3 text-sm text-[#cfd7ff]">{speaker.organization}</p>
        <button
          type="button"
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#5d13ff] to-[#5b7dff] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(89,80,255,0.28)]"
        >
          View Profile
        </button>
      </div>
    </article>
  );
}
