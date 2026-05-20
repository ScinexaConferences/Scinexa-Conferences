import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import scinexaLogo from "../assets/scinexa-logo.svg";
import { api } from "../services/api";
import { setCredentials } from "../store";
import { getAuthErrorMessage } from "../utils/auth";

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
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
      const response = await api.post("/auth/register", form);
      const auth = response.data?.data;

      dispatch(
        setCredentials({
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          user: {
            email: auth.email,
            fullName: auth.fullName,
            roles: Array.isArray(auth?.roles) ? auth.roles : []
          }
        })
      );

      navigate("/dashboard");
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-gap">
      <div className="page-shell">
        <div className="grid overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/85 shadow-[0_30px_80px_rgba(43,27,104,0.12)] lg:grid-cols-[1fr_1fr] dark:border-white/10 dark:bg-white/5">
          <div className="p-8 sm:p-10">
            <div className="mx-auto max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Register</p>
              <h1 className="mt-3 font-display text-4xl font-bold">Create your Scinexa account</h1>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                New users register as attendees by default and can immediately access the dashboard after signup.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold">Full name</span>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Dr. Maya Sterling"
                    className="w-full rounded-[1.35rem] border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/5"
                    required
                  />
                </label>

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
                    placeholder="At least 8 characters"
                    minLength={8}
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
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </form>

              <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <span>Already have an account?</span>
                <Link to="/login" className="font-semibold text-[#572bdf] underline decoration-[#b9a9ff] underline-offset-4">
                  Go to login
                </Link>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#f5efff,#ffffff_52%,#f8f2ea)] p-8 sm:p-10 dark:bg-[linear-gradient(135deg,#161034,#22154d_52%,#392082)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(112,80,255,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(93,212,209,0.18),_transparent_24%)] dark:opacity-70" />
            <div className="relative">
              <img src={scinexaLogo} alt="Scinexa Conferences" className="h-14 w-auto" />
              <p className="mt-10 text-sm font-semibold uppercase tracking-[0.3em] text-[#6c45e0] dark:text-[#9edaff]">Attendee onboarding</p>
              <h2 className="mt-4 max-w-md font-display text-4xl font-bold leading-tight text-[#190f3e] dark:text-white">
                Join the platform and start discovering scientific events right away.
              </h2>
              <div className="mt-10 grid gap-4">
                {[
                  "Save conferences from the directory.",
                  "Move into the registration flow faster.",
                  "Access attendee dashboard views after signup.",
                  "Upgrade workflows later for organizers and admins."
                ].map((item) => (
                  <article
                    key={item}
                    className="rounded-[1.5rem] border border-black/5 bg-white/80 p-4 text-sm font-medium text-[#2f235c] shadow-[0_16px_40px_rgba(56,34,130,0.08)] dark:border-white/10 dark:bg-white/10 dark:text-white"
                  >
                    {item}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
