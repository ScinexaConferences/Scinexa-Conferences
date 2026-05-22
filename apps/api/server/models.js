import mongoose from "mongoose";

const timestampOptions = {
  createdAt: "created_at",
  updatedAt: "updated_at"
};

const defaultSchemaOptions = {
  versionKey: false,
  timestamps: timestampOptions
};

const singletonSchemaOptions = {
  ...defaultSchemaOptions,
  _id: false
};

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ["ATTENDEE"] },
    active: { type: Boolean, default: true }
  },
  { ...defaultSchemaOptions, collection: "users" }
);

const conferenceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    venueName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    ticketPriceFrom: { type: Number, required: true },
    tracks: { type: [String], default: [] },
    keywords: { type: [String], default: [] },
    status: { type: String, enum: ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"], required: true },
    featured: { type: Boolean, default: false }
  },
  { ...defaultSchemaOptions, collection: "conferences" }
);

const registrationSchema = new mongoose.Schema(
  {
    referenceCode: { type: String, required: true },
    titlePrefix: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    organization: { type: String, default: "" },
    country: { type: String, required: true },
    billingAddress: { type: String, required: true },
    registrationPhase: { type: String, required: true },
    registrationCategory: { type: String, required: true },
    registrationAmount: { type: Number, required: true },
    accommodationPackage: { type: String, required: true },
    occupancyType: { type: String, required: true },
    accommodationAmount: { type: Number, required: true },
    participantsCount: { type: Number, required: true },
    accompanyingPersonsCount: { type: Number, required: true },
    accompanyingFee: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    paymentGateway: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    paymentOrderId: { type: String, required: true },
    paymentReceiptId: { type: String, required: true },
    paymentTransactionId: { type: String, required: true },
    currency: { type: String, required: true }
  },
  { ...defaultSchemaOptions, collection: "registrations" }
);

const abstractSubmissionSchema = new mongoose.Schema(
  {
    referenceCode: { type: String, required: true },
    reviewStatus: { type: String, required: true },
    titlePrefix: { type: String, required: true },
    presentationType: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    organization: { type: String, required: true },
    department: { type: String, default: "" },
    country: { type: String, required: true },
    abstractTitle: { type: String, required: true },
    sessionTrack: { type: String, required: true },
    abstractText: { type: String, required: true },
    fileName: { type: String, required: true },
    fileKey: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true }
  },
  { ...defaultSchemaOptions, collection: "abstract_submissions" }
);

const homeHeroResourceSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    to: String,
    action: String
  },
  { _id: false }
);

const homeHeroSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    eyebrow: String,
    title: String,
    description: String,
    countdownTarget: String,
    dateText: String,
    locationText: String,
    delegatesText: String,
    venueText: String,
    primaryCtaLabel: String,
    primaryCtaTo: String,
    secondaryCtaLabel: String,
    secondaryCtaTo: String,
    resources: { type: [homeHeroResourceSchema], default: [] }
  },
  { ...singletonSchemaOptions, collection: "home_hero_settings" }
);

const agendaEntrySchema = new mongoose.Schema(
  {
    time: String,
    title: String,
    room: String,
    lead: String,
    tag: String
  },
  { _id: false }
);

const agendaDaySchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    items: { type: [agendaEntrySchema], default: [] }
  },
  { _id: false }
);

const agendaSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    days: { type: [agendaDaySchema], default: [] }
  },
  { ...singletonSchemaOptions, collection: "agenda_settings" }
);

const speakerProfileSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    organization: String,
    image: String,
    category: String
  },
  { _id: false }
);

const speakersSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    speakers: { type: [speakerProfileSchema], default: [] }
  },
  { ...singletonSchemaOptions, collection: "speakers_settings" }
);

const committeeMemberSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    organization: String,
    image: String
  },
  { _id: false }
);

const committeeSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    members: { type: [committeeMemberSchema], default: [] }
  },
  { ...singletonSchemaOptions, collection: "committee_settings" }
);

const downloadResourceSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    actionLabel: String,
    actionTo: String
  },
  { _id: false }
);

const downloadsSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    resources: { type: [downloadResourceSchema], default: [] }
  },
  { ...singletonSchemaOptions, collection: "downloads_settings" }
);

const sessionContentItemSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    description: String,
    image: String,
    format: String,
    track: String,
    day: String,
    actionLabel: String,
    actionTo: String
  },
  { _id: false }
);

const contentSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    about: {
      eyebrow: String,
      title: String,
      description: String,
      image: String,
      overlayLabel: String,
      overlayTitle: String,
      overlaySubtitle: String,
      ctaLabel: String,
      ctaTo: String,
      paragraphs: { type: [String], default: [] }
    },
    sessions: {
      eyebrow: String,
      title: String,
      description: String,
      ctaTitle: String,
      ctaDescription: String,
      ctaLabel: String,
      ctaTo: String,
      sessions: { type: [sessionContentItemSchema], default: [] }
    },
    abstractSection: {
      eyebrow: String,
      title: String,
      description: String,
      templateLabel: String,
      templateTo: String,
      guidelines: { type: [String], default: [] },
      topics: { type: [String], default: [] },
      beforeSubmit: { type: [String], default: [] },
      countries: { type: [String], default: [] },
      presentationTypes: { type: [String], default: [] },
      authorTitles: { type: [String], default: [] }
    }
  },
  { ...singletonSchemaOptions, collection: "content_settings" }
);

export const User = mongoose.model("User", userSchema);
export const Conference = mongoose.model("Conference", conferenceSchema);
export const ConferenceRegistration = mongoose.model("ConferenceRegistration", registrationSchema);
export const AbstractSubmission = mongoose.model("AbstractSubmission", abstractSubmissionSchema);
export const HomeHeroSettings = mongoose.model("HomeHeroSettings", homeHeroSettingsSchema);
export const AgendaSettings = mongoose.model("AgendaSettings", agendaSettingsSchema);
export const SpeakersSettings = mongoose.model("SpeakersSettings", speakersSettingsSchema);
export const CommitteeSettings = mongoose.model("CommitteeSettings", committeeSettingsSchema);
export const DownloadsSettings = mongoose.model("DownloadsSettings", downloadsSettingsSchema);
export const ContentSettings = mongoose.model("ContentSettings", contentSettingsSchema);
