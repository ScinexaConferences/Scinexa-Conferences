import { dashboardStats } from "../data/mockData";
import { useSelector } from "react-redux";
import { MetricCard } from "../components/MetricCard";

export function DashboardPage() {
  const user = useSelector((state) => state.auth.user);

  return (
    <section className="section-gap">
      <div className="page-shell">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-coral">User dashboard</p>
            <h1 className="mt-4 font-display text-4xl font-bold">Saved conferences, tickets, and submissions</h1>
            {user?.fullName ? (
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Signed in as {user.fullName} ({user.email}).
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <MetricCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
