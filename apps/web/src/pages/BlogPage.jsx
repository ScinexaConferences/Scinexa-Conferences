import { blogPosts } from "../data/mockData";
import { SectionHeading } from "../components/SectionHeading";

export function BlogPage() {
  return (
    <section className="section-gap">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Insights"
          title="SEO-ready content for growth and authority"
          description="Articles, news, and category pages help the platform compound traffic while supporting sponsor and speaker acquisition."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.slug} className="glass-panel rounded-[1.75rem] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Article</p>
              <h2 className="mt-4 font-display text-2xl font-bold">{post.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

