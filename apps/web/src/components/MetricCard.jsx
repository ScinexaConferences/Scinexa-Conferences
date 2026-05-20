export function MetricCard({ label, value }) {
  return (
    <div className="glass-panel rounded-[1.75rem] p-6">
      <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
      <p className="mt-4 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

