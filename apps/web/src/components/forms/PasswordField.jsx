import { useState } from "react";

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12c2.5-4 5.5-6 9-6s6.5 2 9 6c-2.5 4-5.5 6-9 6s-6.5-2-9-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="m3 3 18 18" />
      <path d="M10.6 6.4A9.7 9.7 0 0 1 12 6c3.5 0 6.5 2 9 6a16.7 16.7 0 0 1-3.1 3.7" />
      <path d="M6.4 6.4A17.2 17.2 0 0 0 3 12c2.5 4 5.5 6 9 6 1.2 0 2.3-.2 3.4-.7" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength = 8
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span>
      <div className="group flex items-center rounded-[1.35rem] border border-black/10 bg-white/90 px-4 py-3.5 transition focus-within:border-[#6a3fff] focus-within:ring-4 focus-within:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]">
        <input
          type={isVisible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          required
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-black/[0.04] hover:text-slate-700 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
          aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
        >
          <EyeIcon open={isVisible} />
        </button>
      </div>
    </label>
  );
}
