import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultCommitteeSettings } from "../../data/committeeDefaults";
import { getCommitteeSettings, updateCommitteeSettings } from "../../services/siteSettingsService";
import { getAuthErrorMessage } from "../../utils/auth";
import { StatusToast } from "../modals/StatusToast";

function cloneDefaults() {
  return {
    members: defaultCommitteeSettings.members.map((member) => ({ ...member }))
  };
}

function createEmptyMember() {
  return {
    name: "",
    role: "",
    organization: "",
    image: ""
  };
}

function normalizePayload(form) {
  return {
    members: form.members.map((member) => ({
      name: member.name.trim(),
      role: member.role.trim(),
      organization: member.organization.trim(),
      image: member.image.trim()
    }))
  };
}

export function CommitteeSettingsForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => cloneDefaults());
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const [draftMember, setDraftMember] = useState(() => createEmptyMember());

  const { data } = useQuery({
    queryKey: ["committee-settings"],
    queryFn: getCommitteeSettings,
    initialData: defaultCommitteeSettings,
    staleTime: 30000
  });

  useEffect(() => {
    setForm({
      members: (data?.members?.length ? data.members : defaultCommitteeSettings.members).map((member) => ({ ...member }))
    });
  }, [data]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const mutation = useMutation({
    mutationFn: (payload) => updateCommitteeSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["committee-settings"], updated);
      setError("");
      setToast("Committee updated successfully.");
    },
    onError: (requestError) => {
      setError(getAuthErrorMessage(requestError));
    }
  });

  const resetDraftMember = () => {
    setDraftMember(createEmptyMember());
  };

  const openAddMemberModal = () => {
    setEditingMemberIndex(null);
    resetDraftMember();
    setIsMemberModalOpen(true);
    setError("");
  };

  const openEditMemberModal = (index) => {
    setEditingMemberIndex(index);
    setDraftMember({ ...form.members[index] });
    setIsMemberModalOpen(true);
    setError("");
  };

  const handleDraftChange = (field, value) => {
    setDraftMember((current) => ({ ...current, [field]: value }));
  };

  const handleRemoveMember = (index) => {
    setForm((current) => ({
      ...current,
      members: current.members.length > 1 ? current.members.filter((_, memberIndex) => memberIndex !== index) : current.members
    }));
    setError("");
  };

  const handleMemberSubmit = (event) => {
    event.preventDefault();

    const normalizedMember = {
      name: draftMember.name.trim(),
      role: draftMember.role.trim(),
      organization: draftMember.organization.trim(),
      image: draftMember.image.trim()
    };

    if (!normalizedMember.name || !normalizedMember.role || !normalizedMember.organization || !normalizedMember.image) {
      setError("Please complete every committee field before saving the member.");
      return;
    }

    setForm((current) => ({
      ...current,
      members:
        editingMemberIndex === null
          ? [...current.members, normalizedMember]
          : current.members.map((member, index) => (index === editingMemberIndex ? normalizedMember : member))
    }));

    setEditingMemberIndex(null);
    resetDraftMember();
    setIsMemberModalOpen(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.members.length) {
      setError("Please keep at least one committee member.");
      return;
    }

    const hasEmptyField = form.members.some(
      (member) => !member.name.trim() || !member.role.trim() || !member.organization.trim() || !member.image.trim()
    );

    if (hasEmptyField) {
      setError("Please complete every committee field before saving.");
      return;
    }

    await mutation.mutateAsync(normalizePayload(form));
  };

  return (
    <>
      <StatusToast message={toast} />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="rounded-[2rem] border border-white/50 bg-white/78 p-6 shadow-[0_25px_70px_rgba(11,22,56,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] sm:p-7"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Committee manager</p>
        <h3 className="mt-3 font-display text-3xl font-bold">Manage committee members</h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          These committee cards power the public committee page and the leadership preview used across the conference experience.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem] border border-black/5 bg-black/[0.015] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
                Committee library
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Add, edit, and remove committee members shown on the public page.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddMemberModal}
              className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-5 py-2.5 text-sm font-semibold text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            >
              Add member
            </button>
          </div>

          <div className="overflow-hidden rounded-[1.8rem] border border-black/5 bg-white/80 shadow-[0_16px_38px_rgba(15,24,58,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
            <div className="hidden grid-cols-[84px_minmax(0,1.1fr)_minmax(0,1fr)_240px] gap-4 border-b border-black/5 bg-black/[0.02] px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 lg:grid">
              <span>Photo</span>
              <span>Member</span>
              <span>Role</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/10">
              {form.members.map((member, index) => (
                <div
                  key={`${member.name}-${index}`}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[84px_minmax(0,1.1fr)_minmax(0,1fr)_240px] lg:items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-16 w-16 rounded-2xl border border-black/5 object-cover dark:border-white/10"
                    />
                    <div className="lg:hidden">
                      <p className="font-semibold text-slate-900 dark:text-white">{member.name}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{member.role}</p>
                    </div>
                  </div>

                  <div className="hidden min-w-0 lg:block">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{member.name}</p>
                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-300">{member.organization}</p>
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-100">{member.role}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300 lg:hidden">{member.organization}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openEditMemberModal(index)}
                      className="inline-flex rounded-full border border-[#ddd7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5124c7] transition hover:bg-[#f6f1ff] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      disabled={form.members.length === 1}
                      className="inline-flex rounded-full border border-[#f4ccd6] bg-[#fff1f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#991f3d] transition hover:bg-[#ffe7ef] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#7a2940] dark:bg-[#461224] dark:text-[#ffdbe5]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error ? (
            <div className="rounded-[1rem] border border-[#f1cad2] bg-[#fff1f4] px-4 py-3 text-sm font-medium text-[#a02841]">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex rounded-full bg-[#241133] px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(36,17,51,0.2)] transition hover:-translate-y-0.5 hover:bg-[#34154b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mutation.isPending ? "Saving..." : "Save committee"}
            </button>
          </div>
        </form>
      </motion.section>

      <AnimatePresence>
        {isMemberModalOpen ? (
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
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/50 bg-white/92 p-6 shadow-[0_35px_90px_rgba(7,11,22,0.2)] dark:border-white/10 dark:bg-[#0d1528]/95"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
                {editingMemberIndex === null ? "Add member" : "Edit member"}
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold">
                {editingMemberIndex === null ? "Create a new committee card" : "Update committee member"}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Fill out the committee details below. The row will update after you confirm.
              </p>

              <form onSubmit={handleMemberSubmit} className="mt-6 space-y-5">
                <div className="grid gap-4 xl:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">Name</span>
                    <input
                      type="text"
                      value={draftMember.name}
                      onChange={(event) => handleDraftChange("name", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold">Role</span>
                    <input
                      type="text"
                      value={draftMember.role}
                      onChange={(event) => handleDraftChange("role", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>

                  <label className="block space-y-2 xl:col-span-2">
                    <span className="text-sm font-semibold">Organization</span>
                    <input
                      type="text"
                      value={draftMember.organization}
                      onChange={(event) => handleDraftChange("organization", event.target.value)}
                      className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                      required
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold">Image URL</span>
                  <input
                    type="url"
                    value={draftMember.image}
                    onChange={(event) => handleDraftChange("image", event.target.value)}
                    className="w-full rounded-[1.1rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#6a3fff] focus:ring-4 focus:ring-[#e6dcff] dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  />
                </label>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMemberModalOpen(false);
                      setEditingMemberIndex(null);
                      resetDraftMember();
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-[#241133] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(36,17,51,0.2)] transition hover:bg-[#34154b]"
                  >
                    {editingMemberIndex === null ? "Add member" : "Save changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
