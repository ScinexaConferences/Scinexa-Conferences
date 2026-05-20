export function CommitteeCard({ member }) {
  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-[#5162d9]/45 bg-white shadow-[0_20px_42px_rgba(19,26,56,0.12)]">
      <img src={member.image} alt={member.name} className="h-80 w-full object-cover" />
      <div className="border-t border-[#d7ddff] px-5 py-6 text-center">
        <h3 className="font-display text-[1.8rem] font-bold leading-tight text-[#20214b]">{member.name}</h3>
        <p className="mt-4 text-lg font-semibold text-[#4723b8]">{member.role}</p>
        <p className="mt-3 text-lg text-[#2f3672]">{member.organization}</p>
        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-[#5a69d8] px-5 py-3 text-sm font-semibold text-[#3643a4] transition hover:bg-[#f4f6ff]"
        >
          View Profile
        </button>
      </div>
    </article>
  );
}
