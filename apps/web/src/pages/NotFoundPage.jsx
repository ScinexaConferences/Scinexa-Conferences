import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="section-gap">
      <div className="page-shell text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-coral">404</p>
        <h1 className="mt-4 font-display text-5xl font-bold">Page not found</h1>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-white dark:bg-white dark:text-ink">
          Return home
        </Link>
      </div>
    </section>
  );
}

