import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import scinexaLogo from "../assets/scinexa-logo.svg";
import { loginAdmin } from "../services/authService";
import { setCredentials } from "../store";
import { getAuthErrorMessage } from "../utils/auth";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(
    location.state?.reason === "expired" ? "Your session expired. Please sign in again." : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const auth = await loginAdmin(form);
      const roles = Array.isArray(auth?.roles) ? auth.roles : [];

      dispatch(
        setCredentials({
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          user: {
            email: auth.email,
            fullName: auth.fullName,
            roles
          }
        })
      );

      navigate(roles.includes("ADMIN") ? "/admin" : "/dashboard", { replace: true });
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-gap">
      <div className="page-shell">
        <div className="grid overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/85 shadow-[0_30px_80px_rgba(43,27,104,0.12)] lg:grid-cols-[0.92fr_1.08fr] dark:border-white/10 dark:bg-white/5">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#150d37,#241753_52%,#5a30df)] p-8 text-white sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(136,217,255,0.26),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.14),_transparent_24%)]" />
            <div className="relative">
              <img src={scinexaLogo} alt="Scinexa Conferences" className="h-14 w-auto rounded-2xl bg-white px-3 py-2" />
              <p className="mt-10 text-sm font-semibold uppercase tracking-[0.3em] text-[#9bdcff]">Welcome back</p>
              <h1 className="mt-4 max-w-md font-display text-4xl font-bold leading-tight sm:text-5xl">
                Sign in to manage registrations, dashboards, and conference operations.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-slate-100">
                Attendees land in their personal dashboard. Admin users can jump straight into the operations cockpit after login.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Auth endpoint", value: "/api/v1/auth/login" },
                  { label: "Post-login", value: "Dashboard or Admin" },
                  { label: "Session mode", value: "JWT + refresh token" },
                  { label: "Audience", value: "Attendees and admins" }
                ].map((item) => (
                  <article key={item.label} className="rounded-[1.5rem] border border-white/12 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a9e7ff]">{item.label}</p>
                    <p className="mt-3 text-sm font-semibold text-white">{item.value}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="mx-auto max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Login</p>
              <h2 className="mt-3 font-display text-4xl font-bold">Access your Scinexa account</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Use the email and password registered in the backend auth service.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@organization.com"
                    className="w-full rounded-[1.35rem] border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/5"
                    required
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold">Password</span>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-[1.35rem] border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/5"
                    required
                  />
                </label>

                {error ? (
                  <div className="rounded-[1.35rem] border border-[#ffcfd3] bg-[#fff3f4] px-4 py-3 text-sm font-medium text-[#9a2c37]">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#5828ff] to-[#6f45ff] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_34px_rgba(98,63,176,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <span>Need an account?</span>
                <Link to="/register" className="font-semibold text-[#572bdf] underline decoration-[#b9a9ff] underline-offset-4">
                  Create one here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
