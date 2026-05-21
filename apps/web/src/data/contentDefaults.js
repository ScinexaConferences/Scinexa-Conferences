export const defaultContentSettings = {
  about: {
    eyebrow: "About This Conference",
    title: "A sharper scientific meeting experience built for serious collaboration",
    description:
      "Inspired by premium congress layouts, this section frames the event as more than a registration page. It presents the conference as a destination for research exchange, practical insight, and long-tail professional relationships.",
    image: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=1200&q=80",
    overlayLabel: "Host City",
    overlayTitle: "Singapore Expo Convention Centre",
    overlaySubtitle: "September 18-20, 2026",
    ctaLabel: "Read More About",
    ctaTo: "/about",
    paragraphs: [
      "3rd International Congress on Clinical Microbiology and Infectious Diseases is designed to bring together clinicians, microbiologists, infectious disease specialists, and translational researchers in a setting that feels focused, credible, and globally connected.",
      "Across the program, delegates can move between keynote thinking, evidence-led breakout sessions, sponsor interaction, and peer conversations that carry useful ideas back into hospitals, laboratories, universities, and public health teams."
    ]
  },
  sessions: {
    eyebrow: "Sessions",
    title: "Explore the scientific sessions shaping the full conference experience",
    description:
      "A dedicated session library with day-based filtering, premium presentation, and clear paths into abstract and registration actions.",
    ctaTitle: "Submit Abstract",
    ctaDescription: "Share your work with the scientific committee.",
    ctaLabel: "Open",
    ctaTo: "/abstract",
    sessions: [
      {
        id: "microbial-pathogenesis",
        title: "Microbial Pathogenesis",
        description: "Actionable methods and translational frameworks delegates can apply within modern microbiology programs.",
        image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80",
        format: "Hands-on Workshop",
        track: "Foundational",
        day: "Day-01",
        actionLabel: "View Details",
        actionTo: "/abstract"
      },
      {
        id: "diagnostic-microbiology",
        title: "Diagnostic Microbiology",
        description: "Benchmark frameworks from top-performing labs and institutes with emphasis on workflow reliability.",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
        format: "Panel Discussion",
        track: "Advanced",
        day: "Day-01",
        actionLabel: "View Details",
        actionTo: "/abstract"
      },
      {
        id: "infectious-diseases-forum",
        title: "Infectious Diseases",
        description: "Live examples mapping bench research to real-world implementation and clinical care pathways.",
        image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80",
        format: "Case Study Forum",
        track: "Translational",
        day: "Day-02",
        actionLabel: "View Details",
        actionTo: "/abstract"
      },
      {
        id: "antibiotic-resistance",
        title: "Antibiotic Resistance",
        description: "Cross-disciplinary insight for rapid experimentation cycles, governance, and implementation readiness.",
        image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80",
        format: "Rapid Fire Talk",
        track: "Policy and Implementation",
        day: "Day-02",
        actionLabel: "View Details",
        actionTo: "/abstract"
      },
      {
        id: "viral-genomics",
        title: "Viral Genomics",
        description: "Actionable sequencing perspectives for surveillance, outbreak mapping, and collaborative response planning.",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
        format: "Hands-on Workshop",
        track: "Foundational",
        day: "Day-03",
        actionLabel: "View Details",
        actionTo: "/abstract"
      },
      {
        id: "surveillance-networks",
        title: "Surveillance Networks",
        description: "Strategic conversations around reporting systems, regional visibility, and cross-institution coordination.",
        image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80",
        format: "Roundtable",
        track: "Public Health",
        day: "Day-03",
        actionLabel: "View Details",
        actionTo: "/abstract"
      }
    ]
  },
  abstractSection: {
    eyebrow: "Abstract",
    title: "Summary Of Your Presentation",
    description: "Everything you need for preparing and submitting your abstract is included on this page.",
    templateLabel: "Download Template",
    templateTo: "/downloads",
    guidelines: [
      "Abstract length should not exceed 300 words excluding title and author information.",
      "Use clear sections: Background, Methods, Results, and Conclusion.",
      "Title should be concise, sentence case, and centered.",
      "List all affiliations below author names and mark presenting author with an asterisk.",
      "Submit in English, using professional scientific terminology only.",
      "Accepted file formats: DOC, DOCX, or PDF. Maximum file size: 5 MB.",
      "References should be minimal and follow standard journal format.",
      "Avoid plagiarism, fabricated data, and unsupported clinical claims.",
      "All submissions are peer-reviewed and final decisions are shared by email."
    ],
    topics: [
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
    ],
    beforeSubmit: [
      "Use a descriptive title and keep the abstract below 300 words.",
      "Select the nearest scientific track for proper reviewer assignment.",
      "Avoid plagiarism and include only validated findings.",
      "Upload DOC, DOCX, or PDF format with readable structure."
    ],
    countries: [
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
    ],
    presentationTypes: [
      "Oral Presentation",
      "Poster Presentation",
      "Workshop Session",
      "Case Study Forum"
    ],
    authorTitles: ["Dr.", "Prof.", "Mr.", "Ms.", "Mx."]
  }
};
