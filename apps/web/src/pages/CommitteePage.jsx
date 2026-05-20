import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CommitteeCard } from "../components/CommitteeCard";
import { SectionHeading } from "../components/SectionHeading";
import { defaultCommitteeSettings } from "../data/committeeDefaults";
import { getCommitteeSettings } from "../services/siteSettingsService";

export function CommitteePage() {
  const { data } = useQuery({
    queryKey: ["committee-settings"],
    queryFn: getCommitteeSettings,
    initialData: defaultCommitteeSettings,
    staleTime: 30000
  });

  const members = data?.members?.length ? data.members : defaultCommitteeSettings.members;

  return (
    <section className="section-gap pt-8 sm:pt-10">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Committee"
          title="Meet the scientific and editorial committee behind the congress"
          description="A strong committee page builds trust for delegates, authors, and sponsors by making the conference leadership visible, credible, and easy to scan."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {members.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: Math.min(index * 0.04, 0.28) }}
            >
              <CommitteeCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
