export const categories = [
  "Medical Sciences",
  "Artificial Intelligence",
  "Biotechnology",
  "Sustainability",
  "Pharma",
  "Public Health"
];

export const conferences = [
  {
    id: "oncology-frontiers",
    title: "World Summit on Precision Oncology",
    category: "Medical Sciences",
    city: "Singapore",
    venue: "Marina Bay Convention Centre",
    startDate: "2026-09-18",
    endDate: "2026-09-20",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    attendees: 2200,
    speakers: 64,
    priceFrom: 499,
    blurb:
      "A premium oncology forum connecting clinical leaders, translational researchers, biotech teams, and care innovators.",
    tracks: ["Immunotherapy", "Radiomics", "Clinical Trials", "Patient Outcomes"]
  },
  {
    id: "ai-health-summit",
    title: "AI in Clinical Decision Systems Congress",
    category: "Artificial Intelligence",
    city: "Barcelona",
    venue: "Fira Gran Via",
    startDate: "2026-10-07",
    endDate: "2026-10-09",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    attendees: 1800,
    speakers: 51,
    priceFrom: 449,
    blurb:
      "Where data science, hospital systems, and regulation teams align around safe and scalable AI adoption.",
    tracks: ["Responsible AI", "Imaging Models", "Clinical NLP", "Hospital Operations"]
  },
  {
    id: "green-bioprocess",
    title: "Global Forum on Sustainable Bioprocessing",
    category: "Biotechnology",
    city: "Amsterdam",
    venue: "RAI Amsterdam",
    startDate: "2026-11-03",
    endDate: "2026-11-05",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    attendees: 950,
    speakers: 36,
    priceFrom: 379,
    blurb:
      "An industry-academic exchange focused on clean production, bio-manufacturing, and scale-up resilience.",
    tracks: ["Fermentation", "Scale Up", "Circular Systems", "Regulatory Readiness"]
  }
];

export const speakers = [
  {
    name: "Dr. Alina Mercer",
    title: "Chief of Translational Oncology",
    organization: "Northbridge Cancer Institute",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Prof. Javier Soto",
    title: "Director of Clinical AI",
    organization: "Catalonia Health Labs",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Dr. Meera Solanki",
    title: "VP, Sustainable Platforms",
    organization: "BioSphere Systems",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80"
  }
];

export const agenda = [
  {
    time: "09:00",
    title: "Opening keynote: Research ecosystems at scale",
    speaker: "Dr. Alina Mercer",
    stage: "Grand Auditorium"
  },
  {
    time: "11:00",
    title: "Panel: Funding translational breakthroughs",
    speaker: "Prof. Javier Soto",
    stage: "Innovation Hall"
  },
  {
    time: "14:00",
    title: "Workshop: AI validation for medical deployment",
    speaker: "Dr. Meera Solanki",
    stage: "Studio C"
  }
];

export const sessionsCatalog = [
  {
    id: "microbial-pathogenesis",
    title: "Microbial Pathogenesis",
    description: "Actionable methods and translational frameworks delegates can apply within modern microbiology programs.",
    image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80",
    format: "Hands-on Workshop",
    track: "Foundational",
    day: "Day-01"
  },
  {
    id: "diagnostic-microbiology",
    title: "Diagnostic Microbiology",
    description: "Benchmark frameworks from top-performing labs and institutes with emphasis on workflow reliability.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
    format: "Panel Discussion",
    track: "Advanced",
    day: "Day-01"
  },
  {
    id: "infectious-diseases-forum",
    title: "Infectious Diseases",
    description: "Live examples mapping bench research to real-world implementation and clinical care pathways.",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80",
    format: "Case Study Forum",
    track: "Translational",
    day: "Day-02"
  },
  {
    id: "antibiotic-resistance",
    title: "Antibiotic Resistance",
    description: "Cross-disciplinary insight for rapid experimentation cycles, governance, and implementation readiness.",
    image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80",
    format: "Rapid Fire Talk",
    track: "Policy and Implementation",
    day: "Day-02"
  },
  {
    id: "viral-genomics",
    title: "Viral Genomics",
    description: "Actionable sequencing perspectives for surveillance, outbreak mapping, and collaborative response planning.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
    format: "Hands-on Workshop",
    track: "Foundational",
    day: "Day-03"
  },
  {
    id: "surveillance-networks",
    title: "Surveillance Networks",
    description: "Strategic conversations around reporting systems, regional visibility, and cross-institution coordination.",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80",
    format: "Roundtable",
    track: "Public Health",
    day: "Day-03"
  }
];

export const testimonials = [
  {
    quote:
      "Scinexa feels like the rare event platform that respects both scientific rigor and attendee experience.",
    author: "Head of Programs, MedAxis Alliance"
  },
  {
    quote:
      "The event discovery flow, sponsorship visibility, and session structure make this immediately usable for a global conference portfolio.",
    author: "Director of Events, Novo Research Collective"
  }
];

export const faqs = [
  {
    question: "Can organizers manage abstract review workflows?",
    answer:
      "Yes. The platform roadmap and backend scaffolding already account for abstract submission, reviewer assignment, approval states, and author notifications."
  },
  {
    question: "Will the platform support multi-language experiences?",
    answer:
      "The frontend structure is prepared for future localization by keeping content sections modular and route definitions centralized."
  },
  {
    question: "Is this designed for multiple conferences, not just one event?",
    answer:
      "Yes. The architecture is multi-conference by default and can evolve into a reusable marketplace-style event engine."
  }
];

export const dashboardStats = [
  { label: "Published conferences", value: "128" },
  { label: "Abstracts under review", value: "942" },
  { label: "Revenue this quarter", value: "$482K" },
  { label: "Sponsor renewals", value: "87%" }
];

export const blogPosts = [
  {
    slug: "future-of-academic-events",
    title: "The new operating model for global academic events",
    excerpt:
      "Why conference brands are shifting from one-off event pages to reusable digital event platforms."
  },
  {
    slug: "sponsorship-design-playbook",
    title: "Designing sponsor journeys that feel premium, not intrusive",
    excerpt:
      "Better sponsor visibility starts with information hierarchy, not more banner clutter."
  }
];
