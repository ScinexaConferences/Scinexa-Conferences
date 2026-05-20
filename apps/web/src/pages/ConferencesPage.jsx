import { useState } from "react";
import { categories, conferences } from "../data/mockData";
import { ConferenceCard } from "../components/ConferenceCard";
import { SectionHeading } from "../components/SectionHeading";

export function ConferencesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filteredConferences = conferences.filter((conference) => {
    const matchesCategory =
      selectedCategory === "All" || conference.category === selectedCategory;
    const matchesQuery =
      conference.title.toLowerCase().includes(query.toLowerCase()) ||
      conference.city.toLowerCase().includes(query.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  return (
    <section className="section-gap">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Conference directory"
          title="Search, filter, and compare upcoming conferences"
          description="This listing page is structured for future API pagination, category filters, and SEO landing pages."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or city"
            className="glass-panel min-h-14 rounded-full px-6 outline-none"
          />
          <div className="flex flex-wrap gap-3">
            {["All", ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-3 text-sm font-semibold ${
                  selectedCategory === category ? "bg-ink text-white dark:bg-white dark:text-ink" : "glass-panel"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {filteredConferences.map((conference) => (
            <ConferenceCard key={conference.id} conference={conference} />
          ))}
        </div>
      </div>
    </section>
  );
}

