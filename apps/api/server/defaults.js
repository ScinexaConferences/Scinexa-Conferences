export const defaultHomeHeroSettings = {
  eyebrow: "Scinexa Conferences",
  title: "3rd International Congress on Clinical Microbiology and Infectious Diseases",
  description:
    "A high-impact scientific gathering focused on precision diagnostics, antimicrobial resistance, translational care, and the future of infectious disease research.",
  countdownTarget: "2026-09-18T09:00",
  dateText: "September 18-20, 2026",
  locationText: "Singapore Expo Convention Centre",
  delegatesText: "1,500+ researchers and clinicians",
  venueText: "Grand Forum Hall, Marina District",
  primaryCtaLabel: "Register Now",
  primaryCtaTo: "/registration",
  secondaryCtaLabel: "Download Brochure",
  secondaryCtaTo: "/downloads",
  resources: [
    {
      title: "Official Brochure",
      subtitle: "Program vision, scientific tracks, and registration flow.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
      to: "/registration",
      action: "Download"
    },
    {
      title: "Submit Abstract",
      subtitle: "Share your research with our global scientific committee.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
      to: "/abstract",
      action: "Open"
    },
    {
      title: "Speaker Guidelines",
      subtitle: "Presentation guidance, timelines, and AV support details.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
      to: "/speakers",
      action: "View"
    },
    {
      title: "Sponsor Prospectus",
      subtitle: "Partnership packages for academia, pharma, and biotech.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      to: "/sponsors",
      action: "Download"
    }
  ]
};

export const defaultAgendaSettings = {
  days: [
    {
      id: "day-1",
      label: "Day 1",
      items: [
        {
          time: "08:00 AM",
          title: "Registration & Continental Breakfast",
          room: "Grand Auditorium",
          lead: "Arrival and badge collection",
          tag: "Break"
        },
        {
          time: "09:00 AM",
          title: "Welcome and Opening Ceremony",
          room: "Innovation Hall",
          lead: "Conference leadership team",
          tag: "Networking"
        },
        {
          time: "10:00 AM",
          title: "Keynote: Engineering the Future of Bacterial Resistance",
          room: "Collaboration Studio",
          lead: "Lead: Dr. Sarah Chen",
          tag: "Keynote"
        },
        {
          time: "11:15 AM",
          title: "Coffee Break & Poster Viewing",
          room: "Summit Room",
          lead: "Poster authors and delegates",
          tag: "Break"
        },
        {
          time: "12:00 PM",
          title: "Viral Genomics: From Code to Cure",
          room: "Grand Auditorium",
          lead: "Lead: Dr. Elena Rodriguez",
          tag: "Session"
        },
        {
          time: "01:30 PM",
          title: "Symposium Lunch",
          room: "Innovation Hall",
          lead: "Hosted networking tables",
          tag: "Networking"
        },
        {
          time: "02:30 PM",
          title: "Clinical Trials in Infectious Diseases",
          room: "Collaboration Studio",
          lead: "Lead: Dr. Robert Wilson",
          tag: "Session"
        },
        {
          time: "04:00 PM",
          title: "Fireside Chat: The AI Revolution in Lab Diagnosis",
          room: "Summit Room",
          lead: "Lead: Dr. Michael Torres",
          tag: "Session"
        }
      ]
    },
    {
      id: "day-2",
      label: "Day 2",
      items: [
        {
          time: "08:30 AM",
          title: "Breakfast Roundtables",
          room: "Networking Lounge",
          lead: "Moderator-led delegate meetups",
          tag: "Networking"
        },
        {
          time: "09:30 AM",
          title: "Diagnostics Panel: Rapid Testing in High-Burden Regions",
          room: "Innovation Hall",
          lead: "Lead: Prof. Hannah Lee",
          tag: "Panel"
        },
        {
          time: "11:00 AM",
          title: "Case Forum: Antimicrobial Stewardship in Practice",
          room: "Clinical Forum",
          lead: "Lead: Dr. Yash Patel",
          tag: "Session"
        },
        {
          time: "01:00 PM",
          title: "Industry Lunch Exchange",
          room: "Grand Auditorium",
          lead: "Sponsors and hospital innovators",
          tag: "Networking"
        },
        {
          time: "02:15 PM",
          title: "Workshop: Translating Surveillance into Policy",
          room: "Collaboration Studio",
          lead: "Lead: Dr. Fatima Noor",
          tag: "Workshop"
        },
        {
          time: "04:15 PM",
          title: "Poster Jury & Innovation Showcase",
          room: "Summit Room",
          lead: "Scientific committee review",
          tag: "Session"
        }
      ]
    },
    {
      id: "day-3",
      label: "Day 3",
      items: [
        {
          time: "09:00 AM",
          title: "Breakfast Briefing: Global Data Sharing",
          room: "Networking Lounge",
          lead: "Program office",
          tag: "Networking"
        },
        {
          time: "10:00 AM",
          title: "Clinical Microbiology Leadership Forum",
          room: "Grand Auditorium",
          lead: "Lead: Prof. Amina Solberg",
          tag: "Keynote"
        },
        {
          time: "11:30 AM",
          title: "Breakout Sessions: Implementation and Scale",
          room: "Parallel Rooms",
          lead: "Track facilitators",
          tag: "Session"
        },
        {
          time: "01:00 PM",
          title: "Delegate Lunch",
          room: "Innovation Hall",
          lead: "Hosted by Scinexa",
          tag: "Break"
        },
        {
          time: "02:15 PM",
          title: "Closing Plenary: Future-Proofing Infectious Disease Research",
          room: "Grand Auditorium",
          lead: "Lead: Dr. Marcus Bell",
          tag: "Plenary"
        },
        {
          time: "03:45 PM",
          title: "Awards, Closing Notes & Next Edition Reveal",
          room: "Grand Auditorium",
          lead: "Conference leadership team",
          tag: "Closing"
        }
      ]
    }
  ]
};

export const defaultSpeakersSettings = {
  speakers: [
    {
      name: "Dr. Sarah Chen",
      title: "Head of Microbiology",
      organization: "Mayo Clinic",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
      category: "Key Note"
    },
    {
      name: "Dr. Michael Torres",
      title: "Chief Scientist",
      organization: "Infectious Research Inst.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
      category: "Speakers"
    },
    {
      name: "Dr. Elena Rodriguez",
      title: "Professor of Virology",
      organization: "Oxford University",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80",
      category: "Speakers"
    },
    {
      name: "Dr. Robert Wilson",
      title: "Director",
      organization: "CDC Labs",
      image: "https://images.unsplash.com/photo-1614436163996-25cee5f54290?auto=format&fit=crop&w=900&q=80",
      category: "Poster"
    },
    {
      name: "Dr. Linda Kaspar",
      title: "Senior Microbiologist",
      organization: "Pasteur Institute",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
      category: "Virtual"
    },
    {
      name: "Dr. James Oakley",
      title: "Public Health Advisor",
      organization: "WHO Europe",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
      category: "Delegate"
    }
  ]
};

export const defaultCommitteeSettings = {
  members: [
    {
      name: "Prof. Hans Muller",
      role: "Chairman",
      organization: "Berlin Tech",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Dr. Anita Gupta",
      role: "Treasurer",
      organization: "Stanford Medical",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Dr. Oliver Thompson",
      role: "General Secretary",
      organization: "University of Cape Town",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Dr. Beatrice Villeray",
      role: "Media Coordinator",
      organization: "Sorbonne University",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Prof. Kenji Sakamoto",
      role: "Scientific Chair",
      organization: "Tokyo University",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Dr. Elena Rodriguez",
      role: "Program Coordinator",
      organization: "Oxford University",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80"
    }
  ]
};

export const defaultDownloadsSettings = {
  resources: [
    {
      title: "Official Brochure 2026",
      description: "Includes event positioning, session highlights, practical delegate notes, and sponsor-facing presentation cues.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
      actionLabel: "Request Brochure",
      actionTo: "/registration"
    },
    {
      title: "Scientific Program Schedule",
      description: "The latest agenda flow with keynotes, breakouts, speaker slots, and networking blocks.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      actionLabel: "Download",
      actionTo: "/agenda"
    },
    {
      title: "Abstract Submission Template",
      description: "Submission guidance, structure cues, and author-ready formatting support for scientific abstracts.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
      actionLabel: "Download",
      actionTo: "/abstract"
    },
    {
      title: "Official Brochure",
      description: "A compact version for delegates who need the conference overview, logistics, and main opportunities at a glance.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      actionLabel: "Request Brochure",
      actionTo: "/contact"
    }
  ]
};

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
