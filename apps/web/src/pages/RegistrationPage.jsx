import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createRegistration } from "../services/registrationService";
import { getAuthErrorMessage } from "../utils/auth";

const countries = ["India", "Singapore", "United Kingdom", "United States", "France", "Germany", "Australia", "Japan"];
const titleOptions = ["Dr.", "Prof.", "Mr.", "Ms.", "Mx."];
const registrationCategories = ["Academic", "Business", "Delegate", "Visitor"];
const occupancyTypes = ["Single Occupancy", "Double Occupancy", "Triple Occupancy"];

const registrationPricing = [
  {
    label: "Early Bird Registration",
    deadline: "Before April 28, 2026",
    prices: { Academic: 499, Business: 599, Delegate: 499, Visitor: 399 }
  },
  {
    label: "Standard Registration",
    deadline: "Before June 30, 2026",
    prices: { Academic: 599, Business: 699, Delegate: 599, Visitor: 449 }
  },
  {
    label: "Late Registration",
    deadline: "Before August 08, 2026",
    prices: { Academic: 699, Business: 799, Delegate: 699, Visitor: 499 }
  },
  {
    label: "Final Call Registration",
    deadline: "Before August 20, 2026",
    prices: { Academic: 799, Business: 899, Delegate: 799, Visitor: 599 }
  }
];

const accommodationPricing = [
  {
    label: "Accommodation Package Bronze",
    date: "Oct 04 - 06, 2026",
    prices: { "Single Occupancy": 440, "Double Occupancy": 500, "Triple Occupancy": 560 }
  },
  {
    label: "Accommodation Package Silver",
    date: "Oct 04 - 07, 2026",
    prices: { "Single Occupancy": 660, "Double Occupancy": 750, "Triple Occupancy": 840 }
  },
  {
    label: "Accommodation Package Gold",
    date: "Oct 04 - 08, 2026",
    prices: { "Single Occupancy": 880, "Double Occupancy": 1000, "Triple Occupancy": 1120 }
  }
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount ?? 0);
}

export function RegistrationPage() {
  const [form, setForm] = useState({
    titlePrefix: "Dr.",
    fullName: "",
    email: "",
    contactNumber: "",
    organization: "",
    country: "",
    billingAddress: "",
    registrationPhase: registrationPricing[0].label,
    registrationCategory: "Academic",
    accommodationPackage: accommodationPricing[0].label,
    occupancyType: "Single Occupancy",
    participantsCount: 1,
    accompanyingPersonsCount: 0,
    paymentGateway: "RAZORPAY",
    acceptTerms: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricing = useMemo(() => {
    const registrationRow = registrationPricing.find((item) => item.label === form.registrationPhase) ?? registrationPricing[0];
    const accommodationRow = accommodationPricing.find((item) => item.label === form.accommodationPackage) ?? accommodationPricing[0];
    const registrationAmount = registrationRow.prices[form.registrationCategory] ?? 0;
    const accommodationAmount = accommodationRow.prices[form.occupancyType] ?? 0;
    const accompanyingFee = Number(form.accompanyingPersonsCount) * 250;
    const subtotal = registrationAmount + accommodationAmount + accompanyingFee;
    const taxAmount = Math.round(subtotal * 0.03);
    const grandTotal = subtotal + taxAmount;

    return {
      registrationAmount,
      accommodationAmount,
      accompanyingFee,
      taxAmount,
      grandTotal
    };
  }, [form]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.country) {
      setError("Please select your country.");
      return;
    }

    if (!form.acceptTerms) {
      setError("Please accept the terms and conditions before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createRegistration({
        titlePrefix: form.titlePrefix,
        fullName: form.fullName,
        email: form.email,
        contactNumber: form.contactNumber,
        organization: form.organization,
        country: form.country,
        billingAddress: form.billingAddress,
        registrationPhase: form.registrationPhase,
        registrationCategory: form.registrationCategory,
        registrationAmount: pricing.registrationAmount,
        accommodationPackage: form.accommodationPackage,
        occupancyType: form.occupancyType,
        accommodationAmount: pricing.accommodationAmount,
        participantsCount: Number(form.participantsCount),
        accompanyingPersonsCount: Number(form.accompanyingPersonsCount),
        accompanyingFee: pricing.accompanyingFee,
        taxAmount: pricing.taxAmount,
        grandTotal: pricing.grandTotal,
        paymentGateway: form.paymentGateway
      });

      setReceipt(response);
      setSuccess("Registration submitted successfully. Dummy Razorpay payment details were generated and sent to the admin dashboard.");
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-gap pt-8 sm:pt-10">
      <div className="page-shell">
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-coral">Conference registration</p>
              <h1 className="mt-4 font-display text-5xl font-bold text-[#23324a] dark:text-white">Fill in the details below</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
                Choose your delegate category, accommodation package, and payment mode. This flow creates a live registration record and pushes dummy Razorpay payment details directly into the admin dashboard.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.7rem] border border-[#d9e7ff] bg-white/88 p-5 shadow-[0_18px_40px_rgba(15,25,55,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Payment mode</p>
                <p className="mt-3 font-display text-2xl font-bold text-[#23324a]">Razorpay Demo</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Sandbox-style order ID, payment ID, receipt ID, and captured status are generated instantly.</p>
              </div>
              <div className="rounded-[1.7rem] border border-[#d9e7ff] bg-white/88 p-5 shadow-[0_18px_40px_rgba(15,25,55,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Admin sync</p>
                <p className="mt-3 font-display text-2xl font-bold text-[#23324a]">Live Row Entry</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Attendee, package, and payment information appears in the admin registrations screen right after submission.</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#cfdaff]" />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.4rem] border border-[#d9e7ff] bg-white/88 p-4 text-sm shadow-[0_12px_28px_rgba(15,25,55,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Selected phase</p>
              <p className="mt-3 font-semibold text-[#23324a]">{form.registrationPhase}</p>
            </div>
            <div className="rounded-[1.4rem] border border-[#d9e7ff] bg-white/88 p-4 text-sm shadow-[0_12px_28px_rgba(15,25,55,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Delegate type</p>
              <p className="mt-3 font-semibold text-[#23324a]">{form.registrationCategory}</p>
            </div>
            <div className="rounded-[1.4rem] border border-[#d9e7ff] bg-white/88 p-4 text-sm shadow-[0_12px_28px_rgba(15,25,55,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Stay package</p>
              <p className="mt-3 font-semibold text-[#23324a]">{form.accommodationPackage}</p>
            </div>
            <div className="rounded-[1.4rem] border border-[#d9e7ff] bg-white/88 p-4 text-sm shadow-[0_12px_28px_rgba(15,25,55,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Current total</p>
              <p className="mt-3 font-semibold text-[#23324a]">{formatCurrency(pricing.grandTotal)}</p>
            </div>
          </div>

          <section className="rounded-[2rem] border border-[#d9e7ff] bg-white/92 p-6 shadow-[0_22px_60px_rgba(15,25,55,0.08)] dark:border-white/10 dark:bg-white/[0.05] sm:p-7">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold">Title</span>
                <select
                  name="titlePrefix"
                  value={form.titlePrefix}
                  onChange={handleChange}
                  className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                >
                  {titleOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Name *</span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">E-Mail *</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your E-Mail"
                  className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Contact No *</span>
                <input
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact No"
                  className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Organization</span>
                <input
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="Organization Name"
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
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold">Billing Address *</span>
                <input
                  name="billingAddress"
                  value={form.billingAddress}
                  onChange={handleChange}
                  placeholder="Billing Address"
                  className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  required
                />
              </label>
            </div>
            <p className="mt-3 text-sm italic text-slate-500 dark:text-slate-300">
              Note: Pro-forma invoice or invoice for registration can be shared after submission.
            </p>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="font-display text-4xl font-bold text-[#23324a] dark:text-white">Book Your Ticket</h2>
              <div className="mt-4 h-px bg-[#cfdaff]" />
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#d9e7ff] bg-white/92 shadow-[0_22px_60px_rgba(15,25,55,0.08)] dark:border-white/10 dark:bg-white/[0.05]">
              <div className="overflow-x-auto">
                <div className="min-w-[880px]">
                  <div className="grid grid-cols-[1.2fr_repeat(4,minmax(120px,1fr))] gap-3 p-4">
                    <div />
                    {registrationCategories.map((category) => (
                      <div key={category} className="rounded-xl bg-[#ff111f] px-4 py-3 text-center text-sm font-semibold text-white">
                        {category}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 px-4 pb-4">
                    {registrationPricing.map((row) => (
                      <div key={row.label} className="grid grid-cols-[1.2fr_repeat(4,minmax(120px,1fr))] gap-3">
                        <div className="rounded-l-[1.2rem] bg-[#30227b] px-5 py-5 text-white">
                          <p className="font-semibold">{row.label}</p>
                          <p className="mt-2 text-sm text-[#cbd0ff]">({row.deadline})</p>
                        </div>
                        {registrationCategories.map((category) => {
                          const isSelected = form.registrationPhase === row.label && form.registrationCategory === category;
                          return (
                            <label
                              key={category}
                              className={`flex items-center justify-center rounded-r-[1.2rem] border px-4 py-5 text-sm font-medium ${
                                isSelected ? "border-[#5e2cff] bg-[#f5f1ff] text-[#2d2257]" : "border-[#edf0ff] bg-white text-slate-600"
                              }`}
                            >
                              <input
                                type="radio"
                                name="registrationSelection"
                                className="mr-3"
                                checked={isSelected}
                                onChange={() => setForm((current) => ({
                                  ...current,
                                  registrationPhase: row.label,
                                  registrationCategory: category
                                }))}
                              />
                              {formatCurrency(row.prices[category])}
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="font-display text-4xl font-bold text-[#23324a] dark:text-white">Book Your Accommodation</h2>
              <div className="mt-4 h-px bg-[#cfdaff]" />
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#d9e7ff] bg-white/92 p-4 shadow-[0_22px_60px_rgba(15,25,55,0.08)] dark:border-white/10 dark:bg-white/[0.05]">
              <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-[1.2fr_repeat(3,minmax(120px,1fr))] gap-3">
                    <div />
                    {occupancyTypes.map((type) => (
                      <div key={type} className="rounded-xl bg-[#ff111f] px-4 py-3 text-center text-sm font-semibold text-white">
                        {type}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 space-y-2">
                    {accommodationPricing.map((row) => (
                      <div key={row.label} className="grid grid-cols-[1.2fr_repeat(3,minmax(120px,1fr))] gap-3">
                        <div className="rounded-l-[1.2rem] bg-[#30227b] px-5 py-5 text-white">
                          <p className="font-semibold">{row.label}</p>
                          <p className="mt-2 text-sm text-[#cbd0ff]">({row.date})</p>
                        </div>
                        {occupancyTypes.map((type) => {
                          const isSelected = form.accommodationPackage === row.label && form.occupancyType === type;
                          return (
                            <label
                              key={type}
                              className={`flex items-center justify-center rounded-r-[1.2rem] border px-4 py-5 text-sm font-medium ${
                                isSelected ? "border-[#5e2cff] bg-[#f5f1ff] text-[#2d2257]" : "border-[#edf0ff] bg-white text-slate-600"
                              }`}
                            >
                              <input
                                type="radio"
                                name="accommodationSelection"
                                className="mr-3"
                                checked={isSelected}
                                onChange={() => setForm((current) => ({
                                  ...current,
                                  accommodationPackage: row.label,
                                  occupancyType: type
                                }))}
                              />
                              {formatCurrency(row.prices[type])}
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Participants</span>
                  <select
                    name="participantsCount"
                    value={form.participantsCount}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    {[1, 2, 3, 4, 5].map((count) => (
                      <option key={count} value={count}>{count}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Accompanying Persons (₹250 each)</span>
                  <select
                    name="accompanyingPersonsCount"
                    value={form.accompanyingPersonsCount}
                    onChange={handleChange}
                    className="w-full rounded-[1rem] border border-[#ddd7ff] bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#ece4ff] dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    {[0, 1, 2, 3, 4].map((count) => (
                      <option key={count} value={count}>{count}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="font-display text-4xl font-bold text-[#23324a] dark:text-white">Summary</h2>
              <div className="mt-4 h-px bg-[#cfdaff]" />
            </div>

            <div className="rounded-[2rem] border border-[#d9e7ff] bg-white/92 p-6 shadow-[0_22px_60px_rgba(15,25,55,0.08)] dark:border-white/10 dark:bg-white/[0.05]">
              <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Selected category", value: form.registrationCategory },
                  { label: "Selected occupancy", value: form.occupancyType },
                  { label: "Participants", value: String(form.participantsCount) },
                  { label: "Accompanying", value: String(form.accompanyingPersonsCount) }
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.2rem] border border-[#edf0ff] bg-white p-4 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">{item.label}</p>
                    <p className="mt-3 font-semibold text-[#23324a]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[1.2rem] border border-[#edf0ff] bg-white p-4 text-sm">
                  <div className="flex justify-between py-2"><span>Registration</span><span>{formatCurrency(pricing.registrationAmount)}</span></div>
                  <div className="flex justify-between py-2"><span>Participants</span><span>{form.participantsCount}</span></div>
                  <div className="flex justify-between py-2"><span>Tax (3%)</span><span>{formatCurrency(pricing.taxAmount)}</span></div>
                </div>
                <div className="rounded-[1.2rem] border border-[#edf0ff] bg-white p-4 text-sm">
                  <div className="flex justify-between py-2"><span>Accommodation</span><span>{formatCurrency(pricing.accommodationAmount)}</span></div>
                  <div className="flex justify-between py-2"><span>Accompanying Fee</span><span>{formatCurrency(pricing.accompanyingFee)}</span></div>
                  <div className="flex justify-between border-t border-[#dbe2ff] py-2 font-semibold"><span>Grand Total</span><span>{formatCurrency(pricing.grandTotal)}</span></div>
                </div>
              </div>

              <div className="mt-6 rounded-[1.2rem] border border-[#edf0ff] bg-white p-6 text-center">
                <h3 className="font-display text-3xl font-bold text-[#23324a]">Choose Payment</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Razorpay is active in demo mode for now. Submitting this form creates a captured dummy payment entry with order ID, receipt ID, and payment ID for the admin team.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-4">
                  <label className={`inline-flex items-center rounded-xl border px-4 py-3 text-sm font-semibold ${form.paymentGateway === "RAZORPAY" ? "border-[#5e2cff] bg-[#f5f1ff]" : "border-[#ddd7ff]"}`}>
                    <input
                      type="radio"
                      name="paymentGateway"
                      value="RAZORPAY"
                      checked={form.paymentGateway === "RAZORPAY"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Razorpay
                  </label>
                  <label className="inline-flex items-center rounded-xl border border-[#ddd7ff] px-4 py-3 text-sm font-semibold text-slate-400">
                    <input type="radio" disabled className="mr-2" />
                    CCAvenue
                  </label>
                </div>

                <label className="mt-5 inline-flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={form.acceptTerms}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  I accept the terms and conditions.
                </label>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex rounded-xl bg-gradient-to-r from-[#8fa2ff] to-[#7f8ef7] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(74,87,184,0.26)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Submitting Registration..." : "Submit Registration"}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="mt-5 rounded-[1rem] border border-[#f1cad2] bg-[#fff1f4] px-4 py-3 text-sm font-medium text-[#a02841]">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="mt-5 rounded-[1rem] border border-[#cfe6d9] bg-[#f1fbf5] px-4 py-3 text-sm font-medium text-[#1d6b3d]">
                  {success}
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#d9e7ff] bg-white/92 p-6 shadow-[0_22px_60px_rgba(15,25,55,0.08)] dark:border-white/10 dark:bg-white/[0.05]">
            <h2 className="font-display text-4xl font-bold text-[#23324a] dark:text-white">Conference Registration Details</h2>
            <div className="mt-6 space-y-3">
              {[
                "Registration benefits",
                "Delegate registration",
                "Poster registration",
                "Video presentation",
                "Gold package",
                "Platinum package",
                "Accommodation details",
                "Accompanying person"
              ].map((item) => (
                <details key={item} className="rounded-[1.2rem] border border-[#edf0ff] bg-white p-4">
                  <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.14em] text-[#24354d]">
                    {item}
                  </summary>
                  <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
                    <li>Access to all conference sessions</li>
                    <li>Certificate accredited by the organizing committee</li>
                    <li>Conference kit and networking access</li>
                  </ul>
                </details>
              ))}
            </div>
          </section>

          {receipt ? (
            <section className="rounded-[2rem] border border-[#d9e7ff] bg-white/92 p-6 shadow-[0_22px_60px_rgba(15,25,55,0.08)] dark:border-white/10 dark:bg-white/[0.05]">
              <h2 className="font-display text-3xl font-bold text-[#23324a] dark:text-white">Dummy Razorpay Receipt</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.2rem] border border-[#edf0ff] bg-white p-4 text-sm">
                  <p><span className="font-semibold">Reference:</span> {receipt.referenceCode}</p>
                  <p className="mt-2"><span className="font-semibold">Method:</span> {receipt.paymentMethod || "Razorpay Standard Checkout"}</p>
                  <p className="mt-2"><span className="font-semibold">Order ID:</span> {receipt.paymentOrderId}</p>
                  <p className="mt-2"><span className="font-semibold">Receipt ID:</span> {receipt.paymentReceiptId || "Generated after sync"}</p>
                  <p className="mt-2"><span className="font-semibold">Payment ID:</span> {receipt.paymentTransactionId}</p>
                </div>
                <div className="rounded-[1.2rem] border border-[#edf0ff] bg-white p-4 text-sm">
                  <p><span className="font-semibold">Gateway:</span> {receipt.paymentGateway}</p>
                  <p className="mt-2"><span className="font-semibold">Status:</span> {receipt.paymentStatus}</p>
                  <p className="mt-2"><span className="font-semibold">Total Paid:</span> {formatCurrency(receipt.grandTotal)}</p>
                  <p className="mt-2"><span className="font-semibold">Admin Sync:</span> Registration row created successfully</p>
                </div>
              </div>
            </section>
          ) : null}
        </motion.form>
      </div>
    </section>
  );
}
