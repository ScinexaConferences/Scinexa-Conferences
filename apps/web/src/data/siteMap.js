export const primaryNavItems = [
  { label: "Home", href: "/", routeMatch: ["/"] },
  { label: "About", href: "/#about", routeMatch: ["/about"], hashMatch: "#about" },
  { label: "Sessions", href: "/sessions", routeMatch: ["/sessions"] },
  { label: "Abstract", href: "/abstract", routeMatch: ["/abstract"] },
  { label: "Agenda", href: "/agenda", routeMatch: ["/agenda"] },
  { label: "Speakers", href: "/speakers", routeMatch: ["/speakers"] },
  { label: "Committee", href: "/committee", routeMatch: ["/committee"] },
  { label: "Downloads", href: "/downloads", routeMatch: ["/downloads"] }
];

export const moreMenuItems = [
  { label: "FAQs", href: "/#faqs", hashMatch: "#faqs" },
  { label: "Terms & Conditions", href: "/#terms", hashMatch: "#terms" },
  { label: "Privacy Policy", href: "/#privacy", hashMatch: "#privacy" },
  { label: "Sponsors", href: "/sponsors", routeMatch: ["/sponsors"] },
  { label: "Journal", href: "/blog", routeMatch: ["/blog"] },
  { label: "Venue", href: "/#venue", hashMatch: "#venue" },
  { label: "CONTACT", href: "/contact", routeMatch: ["/contact"] }
];

export const homepageSectionMap = [
  {
    id: "hero",
    title: "Hero",
    route: "/",
    purpose: "Lead with flagship event messaging, trust signals, and registration CTA.",
    linkedFrom: ["Home"],
    source: "HomePage"
  },
  {
    id: "about",
    title: "About",
    route: "/#about",
    purpose: "Explain the conference platform story and flagship positioning.",
    linkedFrom: ["About"],
    source: "HomePage"
  },
  {
    id: "sessions",
    title: "Sessions",
    route: "/sessions",
    purpose: "Dedicated session directory with day filters, track tags, and session discovery cards.",
    linkedFrom: ["Sessions"],
    source: "SessionsPage"
  },
  {
    id: "abstract",
    title: "Abstract",
    route: "/abstract",
    purpose: "Dedicated abstract submission form with presenter details, track selection, and file upload.",
    linkedFrom: ["Abstract"],
    source: "HomePage + AbstractPage"
  },
  {
    id: "agenda",
    title: "Agenda",
    route: "/agenda",
    purpose: "Dedicated day-wise agenda schedule for the conference program.",
    linkedFrom: ["Agenda"],
    source: "AgendaPage + HomePage"
  },
  {
    id: "speakers",
    title: "Speakers",
    route: "/speakers",
    purpose: "Showcase speaker credibility and discovery pathways.",
    linkedFrom: ["Speakers"],
    source: "SpeakersPage + HomePage"
  },
  {
    id: "committee",
    title: "Committee",
    route: "/committee",
    purpose: "Surface scientific committee leadership for trust and authority.",
    linkedFrom: ["Committee"],
    source: "CommitteePage + HomePage"
  },
  {
    id: "downloads",
    title: "Downloads",
    route: "/downloads",
    purpose: "Hold brochure, toolkit, and sponsor resource actions.",
    linkedFrom: ["Downloads"],
    source: "DownloadsPage + HomePage"
  },
  {
    id: "venue",
    title: "Venue",
    route: "/#venue",
    purpose: "Provide venue and access information for delegates.",
    linkedFrom: ["More"],
    source: "HomePage"
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    route: "/#terms",
    purpose: "Capture commercial and event participation rules.",
    linkedFrom: ["More"],
    source: "HomePage"
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    route: "/#privacy",
    purpose: "Explain delegate, sponsor, and submission data handling.",
    linkedFrom: ["More"],
    source: "HomePage"
  },
  {
    id: "faqs",
    title: "FAQs",
    route: "/#faqs",
    purpose: "Resolve common organizer, author, and delegate questions.",
    linkedFrom: ["More"],
    source: "HomePage"
  }
];

export const routeInventory = [
  {
    title: "Home",
    route: "/",
    status: "Live",
    area: "Marketing",
    summary: "Conference-first landing page with hero, resources, and anchor navigation."
  },
  {
    title: "Conference Directory",
    route: "/conferences",
    status: "Live",
    area: "Discovery",
    summary: "Searchable listing with category filtering."
  },
  {
    title: "Sessions",
    route: "/sessions",
    status: "Live",
    area: "Program",
    summary: "Dedicated session listing page with day filters and CTA-driven cards."
  },
  {
    title: "Conference Details",
    route: "/conferences/:conferenceId",
    status: "Live",
    area: "Discovery",
    summary: "Detail page for event overview, tracks, agenda, and speakers."
  },
  {
    title: "Speakers",
    route: "/speakers",
    status: "Live",
    area: "Program",
    summary: "Speaker profile showcase and credibility layer."
  },
  {
    title: "Committee",
    route: "/committee",
    status: "Live",
    area: "Program",
    summary: "Scientific and editorial committee directory with leadership cards."
  },
  {
    title: "Agenda",
    route: "/agenda",
    status: "Live",
    area: "Program",
    summary: "Schedule list for sessions, speakers, and stages."
  },
  {
    title: "Login",
    route: "/login",
    status: "Live",
    area: "Account",
    summary: "JWT-backed sign-in form that routes admins and attendees to the right dashboard."
  },
  {
    title: "Register",
    route: "/register",
    status: "Live",
    area: "Account",
    summary: "Frontend signup form connected to backend attendee registration."
  },
  {
    title: "Abstract Submission",
    route: "/abstract",
    status: "Live",
    area: "Program",
    summary: "Conference abstract submission form with guidelines, author details, and document upload."
  },
  {
    title: "Downloads",
    route: "/downloads",
    status: "Live",
    area: "Resources",
    summary: "Dedicated downloads hub for brochures, schedules, and abstract templates."
  },
  {
    title: "Registration",
    route: "/registration",
    status: "Live",
    area: "Conversion",
    summary: "Conference registration form with attendee details, pricing selections, and dummy Razorpay payment capture."
  },
  {
    title: "Sponsors",
    route: "/sponsors",
    status: "Live",
    area: "Revenue",
    summary: "Sponsorship packages and partnership messaging."
  },
  {
    title: "Journal",
    route: "/blog",
    status: "Live",
    area: "Content",
    summary: "Authority-building articles and SEO content."
  },
  {
    title: "Contact",
    route: "/contact",
    status: "Scaffolded",
    area: "Lead Capture",
    summary: "Organizer and sponsor inquiry form."
  },
  {
    title: "About",
    route: "/about",
    status: "Live",
    area: "Brand",
    summary: "Platform story and positioning page."
  },
  {
    title: "User Dashboard",
    route: "/dashboard",
    status: "Prototype",
    area: "Account",
    summary: "Saved conferences, tickets, and submissions surface."
  },
  {
    title: "Admin Dashboard",
    route: "/admin",
    status: "Active",
    area: "Operations",
    summary: "Operations cockpit for the whole website map and content inventory."
  }
];

export const adminQuickActions = [
  { label: "Open login page", href: "/login" },
  { label: "Open home experience", href: "/" },
  { label: "Review conference directory", href: "/conferences" },
  { label: "Check abstract submission", href: "/abstract" },
  { label: "Check registration flow", href: "/registration" },
  { label: "Audit contact page", href: "/contact" },
  { label: "Review sponsor packages", href: "/sponsors" },
  { label: "Inspect journal content", href: "/blog" }
];

export const workflowInventory = [
  {
    title: "Registration Flow",
    route: "/registration",
    owner: "Revenue ops",
    status: "Scaffolded",
    coverage: "Delegate identity, conference selection, ticket type, and payment handoff."
  },
  {
    title: "Contact Inquiries",
    route: "/contact",
    owner: "Growth team",
    status: "Scaffolded",
    coverage: "Organizer, sponsor, and media inquiries."
  },
  {
    title: "Conference Discovery",
    route: "/conferences",
    owner: "Content team",
    status: "Live",
    coverage: "Search, category filtering, and detail-page entry."
  },
  {
    title: "Speaker Visibility",
    route: "/speakers",
    owner: "Program team",
    status: "Live",
    coverage: "Profiles, credibility, and program discovery."
  }
];
