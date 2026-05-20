import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DownloadCard } from "../components/DownloadCard";
import { SectionHeading } from "../components/SectionHeading";
import { defaultDownloadsSettings } from "../data/downloadsDefaults";
import { getDownloadsSettings } from "../services/siteSettingsService";

export function DownloadsPage() {
  const { data } = useQuery({
    queryKey: ["downloads-settings"],
    queryFn: getDownloadsSettings,
    initialData: defaultDownloadsSettings,
    staleTime: 30000
  });

  const resources = data?.resources?.length ? data.resources : defaultDownloadsSettings.resources;

  return (
    <section className="section-gap pt-8 sm:pt-10">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Downloads"
          title="Brochures, templates, and program-ready assets in one place"
          description="This downloads hub gives delegates, authors, and sponsors a clean place to access the core conference resources without hunting through the rest of the site."
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-4">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: Math.min(index * 0.04, 0.28) }}
            >
              <DownloadCard resource={resource} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
