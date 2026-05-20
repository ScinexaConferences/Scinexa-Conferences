import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getRegistrations } from "../../services/registrationService";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount ?? 0);
}

function formatDate(value) {
  if (!value) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatStatusLabel(value) {
  if (!value) {
    return "Pending";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ManageRegistrations() {
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["registrations"],
    queryFn: getRegistrations,
    staleTime: 15000
  });

  const stats = useMemo(() => {
    const totalRevenue = registrations.reduce((sum, item) => sum + (item.grandTotal ?? 0), 0);
    const razorpayCount = registrations.filter((item) => item.paymentGateway === "RAZORPAY").length;

    return {
      count: registrations.length,
      revenue: totalRevenue,
      razorpayCount
    };
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return registrations;
    }

    return registrations.filter((registration) =>
      [
        registration.referenceCode,
        registration.fullName,
        registration.email,
        registration.organization,
        registration.country,
        registration.paymentTransactionId,
        registration.paymentOrderId
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [registrations, searchValue]);

  return (
    <>
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
        <div className="rounded-[2rem] border border-white/50 bg-white/78 p-6 shadow-[0_25px_70px_rgba(11,22,56,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Registrations</p>
          <h3 className="mt-3 font-display text-3xl font-bold">Manage attendee registrations and payments</h3>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Registrations submitted from the public form are listed here with attendee details, selected package, and dummy Razorpay payment records.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Total registrations</p>
              <p className="mt-3 font-display text-4xl font-bold">{stats.count}</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Dummy revenue</p>
              <p className="mt-3 font-display text-4xl font-bold">{formatCurrency(stats.revenue)}</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Razorpay payments</p>
              <p className="mt-3 font-display text-4xl font-bold">{stats.razorpayCount}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Row-wise attendee records</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Search by reference, attendee name, email, organization, or dummy Razorpay order and payment IDs.
              </p>
            </div>
            <label className="block w-full max-w-md">
              <span className="sr-only">Search registrations</span>
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search registrations or payment IDs"
                className="w-full rounded-[1.2rem] border border-black/8 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7f5cff] focus:ring-4 focus:ring-[#ede6ff] dark:border-white/10 dark:bg-white/[0.04]"
              />
            </label>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-black/5 bg-white/80 shadow-[0_16px_38px_rgba(15,24,58,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
            <div className="hidden grid-cols-[140px_minmax(0,1.4fr)_180px_180px_150px_180px] gap-4 border-b border-black/5 bg-black/[0.02] px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 lg:grid">
              <span>Reference</span>
              <span>User Details</span>
              <span>Registration</span>
              <span>Payment</span>
              <span>Total</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/10">
              {isLoading ? (
                <div className="px-5 py-6 text-sm text-slate-500 dark:text-slate-300">Loading registrations...</div>
              ) : filteredRegistrations.length ? (
                filteredRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="grid gap-4 px-5 py-5 lg:grid-cols-[140px_minmax(0,1.4fr)_180px_180px_150px_180px] lg:items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{registration.referenceCode}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{formatDate(registration.createdAt)}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white">{registration.titlePrefix} {registration.fullName}</p>
                      <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-300">{registration.email}</p>
                      <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-300">{registration.country} · {registration.contactNumber}</p>
                      <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-300">{registration.organization || "Independent attendee"}</p>
                    </div>

                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">{registration.registrationCategory}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{registration.registrationPhase}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{registration.accommodationPackage}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{registration.occupancyType}</p>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-[#ece5ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5227c9]">
                          {registration.paymentGateway}
                        </span>
                        <span className="inline-flex rounded-full bg-[#e9f9ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#147443]">
                          {formatStatusLabel(registration.paymentStatus)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{registration.paymentMethod || "Razorpay Standard Checkout"}</p>
                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-300">{registration.paymentTransactionId}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(registration.grandTotal)}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{registration.participantsCount} participant(s)</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{registration.currency}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRegistration(registration)}
                        className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-6 text-sm text-slate-500 dark:text-slate-300">
                  {registrations.length ? "No registrations matched your search." : "No registrations yet."}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {selectedRegistration ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#070b16]/60 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/50 bg-white/92 p-6 shadow-[0_35px_90px_rgba(7,11,22,0.2)] dark:border-white/10 dark:bg-[#0d1528]/95"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">Registration details</p>
              <h3 className="mt-3 font-display text-3xl font-bold">{selectedRegistration.referenceCode}</h3>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.4rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">User details</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="font-semibold">Name:</span> {selectedRegistration.titlePrefix} {selectedRegistration.fullName}</p>
                    <p><span className="font-semibold">Email:</span> {selectedRegistration.email}</p>
                    <p><span className="font-semibold">Phone:</span> {selectedRegistration.contactNumber}</p>
                    <p><span className="font-semibold">Organization:</span> {selectedRegistration.organization || "Independent attendee"}</p>
                    <p><span className="font-semibold">Country:</span> {selectedRegistration.country}</p>
                    <p><span className="font-semibold">Billing:</span> {selectedRegistration.billingAddress}</p>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Payment details</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="font-semibold">Gateway:</span> {selectedRegistration.paymentGateway}</p>
                    <p><span className="font-semibold">Method:</span> {selectedRegistration.paymentMethod || "Razorpay Standard Checkout"}</p>
                    <p><span className="font-semibold">Status:</span> {formatStatusLabel(selectedRegistration.paymentStatus)}</p>
                    <p><span className="font-semibold">Order ID:</span> {selectedRegistration.paymentOrderId}</p>
                    <p><span className="font-semibold">Receipt ID:</span> {selectedRegistration.paymentReceiptId || "Pending receipt sync"}</p>
                    <p><span className="font-semibold">Payment ID:</span> {selectedRegistration.paymentTransactionId}</p>
                    <p><span className="font-semibold">Currency:</span> {selectedRegistration.currency}</p>
                    <p><span className="font-semibold">Captured At:</span> {formatDate(selectedRegistration.createdAt)}</p>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Registration package</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="font-semibold">Phase:</span> {selectedRegistration.registrationPhase}</p>
                    <p><span className="font-semibold">Category:</span> {selectedRegistration.registrationCategory}</p>
                    <p><span className="font-semibold">Registration Fee:</span> {formatCurrency(selectedRegistration.registrationAmount)}</p>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Accommodation and totals</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="font-semibold">Package:</span> {selectedRegistration.accommodationPackage}</p>
                    <p><span className="font-semibold">Occupancy:</span> {selectedRegistration.occupancyType}</p>
                    <p><span className="font-semibold">Stay Fee:</span> {formatCurrency(selectedRegistration.accommodationAmount)}</p>
                    <p><span className="font-semibold">Accompanying Fee:</span> {formatCurrency(selectedRegistration.accompanyingFee)}</p>
                    <p><span className="font-semibold">Tax:</span> {formatCurrency(selectedRegistration.taxAmount)}</p>
                    <p><span className="font-semibold">Grand Total:</span> {formatCurrency(selectedRegistration.grandTotal)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRegistration(null)}
                  className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
