import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { sessionsCatalog } from "../data/mockData";

const submissionTopics = [
  "Microbial Pathogenesis",
  "Diagnostic Microbiology",
  "Infectious Diseases",
  "Antibiotic Resistance",
  "Viral Genomics",
  "Clinical Immunology",
  "Biofilms & Quorum Sensing",
  "Zoonotic Diseases",
  "Mycology & Parasitology",
  "Public Health Microbiology"
];

const countries = [
  "Singapore",
  "India",
  "United States",
  "United Kingdom",
  "France",
  "Germany",
  "Australia",
  "Japan",
  "Canada",
  "United Arab Emirates"
];

const presentationTypes = [
  "Oral Presentation",
  "Poster Presentation",
  "Workshop Session",
  "Case Study Forum"
];

const authorTitles = ["Dr.", "Prof.", "Mr.", "Ms.", "Mx."];

function countWords(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export function AbstractPage() {
  const [form, setForm] = useState({
    titlePrefix: "Dr.",
    presentationType: "Oral Presentation",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    department: "",
    country: "",
    abstractTitle: "",
    sessionTrack: "",
    abstractText: ""
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wordCount = useMemo(() => countWords(form.abstractText), [form.abstractText]);
  const sessionTracks = useMemo(() => Array.from(new Set(sessionsCatalog.map((session) => session.title))), []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.country) {
      setError("Please select a country.");
      return;
    }

    if (!form.sessionTrack) {
      setError("Please select a scientific track.");
      return;
    }

    if (wordCount > 300) {
      setError("Abstract text must stay within 300 words.");
      return;
    }

    if (!file) {
      setError("Please upload a DOC, DOCX, or PDF file.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const hasAllowedExtension = /\.(pdf|doc|docx)$/i.test(file.name);

    if (!allowedTypes.includes(file.type) && !hasAllowedExtension) {
      setError("Accepted file formats are DOC, DOCX, or PDF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Maximum file size is 5 MB.");
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => window.setTimeout(resolve, 900));

    setIsSubmitting(false);
    setSuccess("Abstract submission received successfully. A confirmation email will follow after review.");
  };

  return (
    <section className="section-gap pt-8 sm:pt-10">
      <div className="page-shell">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.32 }}
            className="rounded-[2.2rem] border border-[#d9e7ff] bg-white/92 p-6 shadow-[0_22px_60px_rgba(15,25,55,0.08)] dark:border-white/10 dark:bg-white/[0.05] sm:p-7"
          >
            <h2 className="font-display text-3xl font-bold text-[#211849] dark:text-white">Abstract Guidelines</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Everything you need for preparing and submitting your abstract is included on this page.
            </p>

            <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-200">
              {[
                "Abstract length should not exceed 300 words excluding title and author information.",
                "Use clear sections: Background, Methods, Results, and Conclusion.",
                "Title should be concise, sentence case, and centered.",
                "List all affiliations below author names and mark presenting author with an asterisk.",
                "Submit in English, using professional scientific terminology only.",
                "Accepted file formats: DOC, DOCX, or PDF. Maximum file size: 5 MB.",
                "References should be minimal and follow standard journal format.",
                "Avoid plagiarism, fabricated data, and unsupported clinical claims.",
                "All submissions are peer-reviewed and final decisions are shared by email."
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#546fff]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="font-display text-2xl font-bold text-[#211849] dark:text-white">Submission Focus Topics</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Select the most relevant track so your abstract reaches the correct peer-review panel.
              </p>

              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                {submissionTopics.map((topic) => (
                  <li key={topic} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#546fff]" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="font-display text-2xl font-bold text-[#211849] dark:text-white">Before You Submit</h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                {[
                  "Use a descriptive title and keep the abstract below 300 words.",
                  "Select the nearest scientific track for proper reviewer assignment.",
                  "Avoid plagiarism and include only validated findings.",
                  "Upload DOC, DOCX, or PDF format with readable structure."
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#546fff]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.32, delay: 0.06 }}
            className="rounded-[2.2rem] border border-[#d9e7ff] bg-white/92 p-6 shadow-[0_22px_60px_rgba(15,25,55,0.08)] dark:border-white/10 dark:bg-white/[0.05] sm:p-7"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Abstract</p>
                <h1 className="mt-3 font-display text-4xl font-bold text-[#211849] dark:text-white">
                  Summary Of Your Presentation
                </h1>
              </div>

              <button
                type="button"
                className="inline-flex rounded-full border border-[#ead8ff] bg-white px-5 py-3 text-sm font-semibold text-[#5b2dd8] shadow-[0_10px_24px_rgba(96,63,163,0.08)] dark:border-white/10 dark:bg-white/[0.05] dark:text-white"
              >
                Download Template
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Title</span>
                  <select
                    name="titlePrefix"
                    value={form.titlePrefix}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    {authorTitles.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">Presentation Type</span>
                  <select
                    name="presentationType"
                    value={form.presentationType}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    {presentationTypes.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">First Name *</span>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">Last Name *</span>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">Email Address *</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">Telephone Number *</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Institution / Organization *</span>
                <input
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  required
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Department</span>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold">Country *</span>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Abstract Title *</span>
                <input
                  name="abstractTitle"
                  value={form.abstractTitle}
                  onChange={handleChange}
                  placeholder="Enter the full title of your abstract"
                  className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">Select Session / Track</span>
                <select
                  name="sessionTrack"
                  value={form.sessionTrack}
                  onChange={handleChange}
                  className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <option value="">Select a scientific track</option>
                  {sessionTracks.map((track) => (
                    <option key={track} value={track}>
                      {track}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold">Abstract Text (Max 300 words)</span>
                  <span className={`text-xs font-semibold ${wordCount > 300 ? "text-[#b4233a]" : "text-slate-500"}`}>
                    {wordCount}/300 words
                  </span>
                </div>
                <textarea
                  name="abstractText"
                  value={form.abstractText}
                  onChange={handleChange}
                  placeholder="Paste your abstract summary here..."
                  rows={7}
                  className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">File Upload (DOC, DOCX, PDF)</span>
                <input
                  type="file"
                  accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                  onChange={handleFileChange}
                  className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#f1ebff] file:px-4 file:py-2 file:font-semibold file:text-[#4520a4] hover:file:bg-[#e7deff] dark:border-white/10 dark:bg-white/[0.04]"
                />
              </label>

              {error ? (
                <div className="rounded-[1rem] border border-[#f1cad2] bg-[#fff1f4] px-4 py-3 text-sm font-medium text-[#a02841]">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-[1rem] border border-[#cfe6d9] bg-[#f1fbf5] px-4 py-3 text-sm font-medium text-[#1d6b3d]">
                  {success}
                </div>
              ) : null}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex rounded-full bg-[#241133] px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(36,17,51,0.2)] transition hover:-translate-y-0.5 hover:bg-[#34154b] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Submit Abstract"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
