import { z } from "zod";
import { ValidationError } from "./errors.js";

const nonEmptyString = z.string().trim().min(1, "Required field");
const emailString = z.string().trim().email("Invalid email address");
const optionalString = z.string().trim().optional().nullable().transform((value) => value ?? "");
const nonNegativeInt = z.number().int().min(0);
const positiveInt = z.number().int().min(1);

function futureDateString(fieldLabel) {
  return z.string().trim().refine((value) => {
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) && timestamp > Date.now();
  }, `${fieldLabel} must be a future date`);
}

function stringList(fieldLabel) {
  return z.array(nonEmptyString).default([]).refine((value) => value.every(Boolean), `${fieldLabel} must not contain empty values`);
}

function withFieldErrors(schema) {
  return (payload) => {
    const result = schema.safeParse(payload);

    if (result.success) {
      return result.data;
    }

    const errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "error";
      errors[key] = issue.message;
    }

    throw new ValidationError("Validation failed", errors);
  };
}

export const parseRegisterRequest = withFieldErrors(
  z.object({
    fullName: nonEmptyString,
    email: emailString,
    password: z.string().min(8, "Password must be at least 8 characters")
  })
);

export const parseLoginRequest = withFieldErrors(
  z.object({
    email: emailString,
    password: nonEmptyString
  })
);

export const parseUpdateProfileRequest = withFieldErrors(
  z.object({
    email: emailString
  })
);

export const parseChangePasswordRequest = withFieldErrors(
  z.object({
    currentPassword: nonEmptyString,
    newPassword: z.string().min(8, "New password must be at least 8 characters")
  })
);

export const parseConferenceRequest = withFieldErrors(
  z.object({
    slug: nonEmptyString,
    title: nonEmptyString,
    category: nonEmptyString,
    shortDescription: nonEmptyString,
    venueName: nonEmptyString,
    city: nonEmptyString,
    country: nonEmptyString,
    startDate: futureDateString("startDate"),
    endDate: futureDateString("endDate"),
    ticketPriceFrom: z.number().min(0),
    tracks: stringList("tracks"),
    keywords: stringList("keywords"),
    status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]),
    featured: z.boolean().default(false)
  }).refine((value) => Date.parse(value.endDate) >= Date.parse(value.startDate), {
    message: "endDate must be on or after startDate",
    path: ["endDate"]
  })
);

export const parseRegistrationRequest = withFieldErrors(
  z.object({
    titlePrefix: nonEmptyString,
    fullName: nonEmptyString,
    email: nonEmptyString,
    contactNumber: nonEmptyString,
    organization: optionalString,
    country: nonEmptyString,
    billingAddress: nonEmptyString,
    registrationPhase: nonEmptyString,
    registrationCategory: nonEmptyString,
    registrationAmount: nonNegativeInt,
    accommodationPackage: nonEmptyString,
    occupancyType: nonEmptyString,
    accommodationAmount: nonNegativeInt,
    participantsCount: positiveInt,
    accompanyingPersonsCount: nonNegativeInt,
    accompanyingFee: nonNegativeInt,
    taxAmount: nonNegativeInt,
    grandTotal: nonNegativeInt,
    paymentGateway: nonEmptyString
  })
);

const homeHeroResourceSchema = z.object({
  title: nonEmptyString,
  subtitle: nonEmptyString,
  image: nonEmptyString,
  to: nonEmptyString,
  action: nonEmptyString
});

const agendaEntrySchema = z.object({
  time: nonEmptyString,
  title: nonEmptyString,
  room: nonEmptyString,
  lead: nonEmptyString,
  tag: nonEmptyString
});

const agendaDaySchema = z.object({
  id: nonEmptyString,
  label: nonEmptyString,
  items: z.array(agendaEntrySchema).min(1, "items must contain at least one entry")
});

const speakerSchema = z.object({
  name: nonEmptyString,
  title: nonEmptyString,
  organization: nonEmptyString,
  image: nonEmptyString,
  category: nonEmptyString
});

const committeeMemberSchema = z.object({
  name: nonEmptyString,
  role: nonEmptyString,
  organization: nonEmptyString,
  image: nonEmptyString
});

const downloadResourceSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
  image: nonEmptyString,
  actionLabel: nonEmptyString,
  actionTo: nonEmptyString
});

const sessionContentItemSchema = z.object({
  id: z.string().trim().optional().nullable().transform((value) => value ?? ""),
  title: nonEmptyString,
  description: nonEmptyString,
  image: nonEmptyString,
  format: nonEmptyString,
  track: nonEmptyString,
  day: nonEmptyString,
  actionLabel: nonEmptyString,
  actionTo: nonEmptyString
});

export const parseHomeHeroSettingsRequest = withFieldErrors(
  z.object({
    eyebrow: nonEmptyString,
    title: nonEmptyString,
    description: nonEmptyString,
    countdownTarget: nonEmptyString,
    dateText: nonEmptyString,
    locationText: nonEmptyString,
    delegatesText: nonEmptyString,
    venueText: nonEmptyString,
    primaryCtaLabel: nonEmptyString,
    primaryCtaTo: nonEmptyString,
    secondaryCtaLabel: nonEmptyString,
    secondaryCtaTo: nonEmptyString,
    resources: z.array(homeHeroResourceSchema).min(1, "resources must contain at least one item")
  })
);

export const parseAgendaSettingsRequest = withFieldErrors(
  z.object({
    days: z.array(agendaDaySchema).min(1, "days must contain at least one item")
  })
);

export const parseSpeakersSettingsRequest = withFieldErrors(
  z.object({
    speakers: z.array(speakerSchema).min(1, "speakers must contain at least one item")
  })
);

export const parseCommitteeSettingsRequest = withFieldErrors(
  z.object({
    members: z.array(committeeMemberSchema).min(1, "members must contain at least one item")
  })
);

export const parseDownloadsSettingsRequest = withFieldErrors(
  z.object({
    resources: z.array(downloadResourceSchema).min(1, "resources must contain at least one item")
  })
);

export const parseContentSettingsRequest = withFieldErrors(
  z.object({
    about: z.object({
      eyebrow: nonEmptyString,
      title: nonEmptyString,
      description: nonEmptyString,
      image: nonEmptyString,
      overlayLabel: nonEmptyString,
      overlayTitle: nonEmptyString,
      overlaySubtitle: nonEmptyString,
      ctaLabel: nonEmptyString,
      ctaTo: nonEmptyString,
      paragraphs: stringList("paragraphs")
    }),
    sessions: z.object({
      eyebrow: nonEmptyString,
      title: nonEmptyString,
      description: nonEmptyString,
      ctaTitle: nonEmptyString,
      ctaDescription: nonEmptyString,
      ctaLabel: nonEmptyString,
      ctaTo: nonEmptyString,
      sessions: z.array(sessionContentItemSchema).default([])
    }),
    abstractSection: z.object({
      eyebrow: nonEmptyString,
      title: nonEmptyString,
      description: nonEmptyString,
      templateLabel: nonEmptyString,
      templateTo: nonEmptyString,
      guidelines: stringList("guidelines"),
      topics: stringList("topics"),
      beforeSubmit: stringList("beforeSubmit"),
      countries: stringList("countries"),
      presentationTypes: stringList("presentationTypes"),
      authorTitles: stringList("authorTitles")
    })
  })
);
