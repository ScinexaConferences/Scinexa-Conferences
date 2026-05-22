import express from "express";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import {
  AgendaSettings,
  AbstractSubmission,
  CommitteeSettings,
  Conference,
  ConferenceRegistration,
  ContentSettings,
  DownloadsSettings,
  HomeHeroSettings,
  SpeakersSettings,
  User
} from "./models.js";
import { config } from "./config.js";
import { authenticateRequest, buildAuthResponse, comparePassword, hashPassword, requireAuth, requireRoles } from "./auth.js";
import { defaultAgendaSettings, defaultCommitteeSettings, defaultContentSettings, defaultDownloadsSettings, defaultHomeHeroSettings, defaultSpeakersSettings } from "./defaults.js";
import { AccessDeniedError, AppError, AuthenticationError, InvalidFileError, PayloadTooLargeError, ResourceNotFoundError, ValidationError } from "./errors.js";
import { deleteManagedFile, downloadFileFromS3, generateFileUrl, uploadAbstractFile, uploadManagedFile } from "./storage.js";
import {
  parseAgendaSettingsRequest,
  parseChangePasswordRequest,
  parseCommitteeSettingsRequest,
  parseConferenceRequest,
  parseContentSettingsRequest,
  parseDownloadsSettingsRequest,
  parseHomeHeroSettingsRequest,
  parseLoginRequest,
  parseRegisterRequest,
  parseRegistrationRequest,
  parseSpeakersSettingsRequest,
  parseUpdateProfileRequest
} from "./validators.js";
import { asyncHandler, failureResponse, normalizeOptionalText, normalizeRequiredText, shortCode, successResponse, toPublicId } from "./utils.js";

const managedUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

const abstractUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

function ensureUserRoles(userDocument) {
  const roles = Array.isArray(userDocument.roles) && userDocument.roles.length ? userDocument.roles : ["ATTENDEE"];
  userDocument.roles = [...new Set(roles)];
  return userDocument.roles;
}

function serializeConference(document) {
  return {
    id: toPublicId(document),
    slug: document.slug,
    title: document.title,
    category: document.category,
    shortDescription: document.shortDescription,
    venueName: document.venueName,
    city: document.city,
    country: document.country,
    startDate: document.startDate,
    endDate: document.endDate,
    ticketPriceFrom: document.ticketPriceFrom,
    tracks: document.tracks ?? [],
    keywords: document.keywords ?? [],
    status: document.status,
    featured: Boolean(document.featured)
  };
}

function serializeRegistration(document) {
  return {
    id: toPublicId(document),
    referenceCode: document.referenceCode,
    titlePrefix: document.titlePrefix,
    fullName: document.fullName,
    email: document.email,
    contactNumber: document.contactNumber,
    organization: document.organization,
    country: document.country,
    billingAddress: document.billingAddress,
    registrationPhase: document.registrationPhase,
    registrationCategory: document.registrationCategory,
    registrationAmount: document.registrationAmount,
    accommodationPackage: document.accommodationPackage,
    occupancyType: document.occupancyType,
    accommodationAmount: document.accommodationAmount,
    participantsCount: document.participantsCount,
    accompanyingPersonsCount: document.accompanyingPersonsCount,
    accompanyingFee: document.accompanyingFee,
    taxAmount: document.taxAmount,
    grandTotal: document.grandTotal,
    paymentGateway: document.paymentGateway,
    paymentMethod: document.paymentMethod,
    paymentStatus: document.paymentStatus,
    paymentOrderId: document.paymentOrderId,
    paymentReceiptId: document.paymentReceiptId,
    paymentTransactionId: document.paymentTransactionId,
    currency: document.currency,
    createdAt: document.created_at?.toISOString?.() ?? null
  };
}

function serializeAbstractSubmission(document) {
  return {
    id: toPublicId(document),
    referenceCode: document.referenceCode,
    reviewStatus: document.reviewStatus,
    titlePrefix: document.titlePrefix,
    presentationType: document.presentationType,
    firstName: document.firstName,
    lastName: document.lastName,
    email: document.email,
    phone: document.phone,
    organization: document.organization,
    department: document.department,
    country: document.country,
    abstractTitle: document.abstractTitle,
    sessionTrack: document.sessionTrack,
    abstractText: document.abstractText,
    fileName: document.fileName,
    fileKey: document.fileKey,
    fileType: document.fileType,
    fileSize: document.fileSize,
    createdAt: document.created_at?.toISOString?.() ?? null
  };
}

function buildPage(content, page, size, totalElements) {
  const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size);

  return {
    content,
    pageable: {
      pageNumber: page,
      pageSize: size,
      offset: page * size,
      paged: true,
      unpaged: false,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true
      }
    },
    totalPages,
    totalElements,
    last: totalPages === 0 ? true : page >= totalPages - 1,
    size,
    number: page,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true
    },
    first: page === 0,
    numberOfElements: content.length,
    empty: content.length === 0
  };
}

function normalizeConferencePayload(payload) {
  return {
    slug: normalizeRequiredText(payload.slug),
    title: normalizeRequiredText(payload.title),
    category: normalizeRequiredText(payload.category),
    shortDescription: normalizeRequiredText(payload.shortDescription),
    venueName: normalizeRequiredText(payload.venueName),
    city: normalizeRequiredText(payload.city),
    country: normalizeRequiredText(payload.country),
    startDate: normalizeRequiredText(payload.startDate),
    endDate: normalizeRequiredText(payload.endDate),
    ticketPriceFrom: payload.ticketPriceFrom,
    tracks: (payload.tracks ?? []).map((item) => normalizeRequiredText(item)),
    keywords: (payload.keywords ?? []).map((item) => normalizeRequiredText(item)),
    status: payload.status,
    featured: Boolean(payload.featured)
  };
}

function resolvePaymentMethod(paymentGateway) {
  if (paymentGateway === "RAZORPAY") {
    return "Razorpay Standard Checkout";
  }

  return `${paymentGateway} Sandbox Checkout`;
}

function countWords(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

async function readSingleton(model, id, fallback) {
  const document = await model.findById(id).lean();
  if (!document) {
    return fallback;
  }

  const { _id, created_at, updated_at, ...payload } = document;
  return payload;
}

async function writeSingleton(model, id, payload) {
  const document = await model.findByIdAndUpdate(
    id,
    { _id: id, ...payload },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: false }
  ).lean();

  const { _id, created_at, updated_at, ...response } = document;
  return response;
}

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Not allowed by CORS"));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(authenticateRequest);

  app.get("/api/v1/dashboard/public", (_req, res) => {
    res.json(
      successResponse("Public dashboard snapshot", {
        publishedConferences: 128,
        countries: 34,
        averageRating: 4.8
      })
    );
  });

  app.get(
    "/api/v1/dashboard/admin",
    requireRoles(["ADMIN"]),
    (_req, res) => {
      res.json(
        successResponse("Admin dashboard snapshot", {
          pendingApprovals: 18,
          paymentsFlagged: 4,
          openAbstracts: 942
        })
      );
    }
  );

  app.post(
    "/api/v1/auth/register",
    asyncHandler(async (req, res) => {
      const payload = parseRegisterRequest(req.body);
      const normalizedEmail = payload.email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        throw new ValidationError("Email is already registered");
      }

      const user = await User.create({
        fullName: payload.fullName.trim(),
        email: normalizedEmail,
        passwordHash: await hashPassword(payload.password),
        roles: ["ATTENDEE"],
        active: true
      });

      res.status(201).json(successResponse("User registered successfully", buildAuthResponse(user)));
    })
  );

  app.post(
    "/api/v1/auth/login",
    asyncHandler(async (req, res) => {
      const payload = parseLoginRequest(req.body);
      const user = await User.findOne({ email: payload.email.trim().toLowerCase() });

      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      ensureUserRoles(user);
      if (!(await comparePassword(payload.password, user.passwordHash))) {
        throw new AuthenticationError("Invalid credentials");
      }

      if (user.isModified()) {
        await user.save();
      }

      res.json(successResponse("Login successful", buildAuthResponse(user)));
    })
  );

  app.post("/api/v1/auth/logout", (_req, res) => {
    res.json(successResponse("Logout successful", null));
  });

  app.put(
    "/api/v1/auth/profile",
    requireAuth,
    asyncHandler(async (req, res) => {
      const payload = parseUpdateProfileRequest(req.body);
      const user = await User.findOne({ email: req.user.email });

      if (!user) {
        throw new AuthenticationError("User not found");
      }

      ensureUserRoles(user);

      const normalizedEmail = payload.email.trim().toLowerCase();
      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          throw new ValidationError("Email is already registered");
        }
      }

      user.email = normalizedEmail;
      await user.save();

      res.json(successResponse("Profile updated successfully", buildAuthResponse(user)));
    })
  );

  app.put(
    "/api/v1/auth/change-password",
    requireAuth,
    asyncHandler(async (req, res) => {
      const payload = parseChangePasswordRequest(req.body);
      const user = await User.findOne({ email: req.user.email });

      if (!user) {
        throw new AuthenticationError("User not found");
      }

      ensureUserRoles(user);

      if (!(await comparePassword(payload.currentPassword, user.passwordHash))) {
        throw new AuthenticationError("Current password is incorrect");
      }

      user.passwordHash = await hashPassword(payload.newPassword);
      await user.save();

      res.json(successResponse("Password changed successfully", null));
    })
  );

  app.get(
    "/api/v1/conferences",
    asyncHandler(async (req, res) => {
      const query = String(req.query.query ?? "").trim();
      const page = Math.max(0, Number.parseInt(String(req.query.page ?? "0"), 10) || 0);
      const size = Math.max(1, Number.parseInt(String(req.query.size ?? "9"), 10) || 9);

      const filters = {
        status: "PUBLISHED",
        ...(query
          ? {
              title: {
                $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                $options: "i"
              }
            }
          : {})
      };

      const [items, totalElements] = await Promise.all([
        Conference.find(filters)
          .sort({ startDate: 1, created_at: -1 })
          .skip(page * size)
          .limit(size)
          .lean(),
        Conference.countDocuments(filters)
      ]);

      res.json(
        successResponse(
          "Published conferences fetched",
          buildPage(items.map(serializeConference), page, size, totalElements)
        )
      );
    })
  );

  app.get(
    "/api/v1/conferences/:slug",
    asyncHandler(async (req, res) => {
      const conference = await Conference.findOne({ slug: req.params.slug }).lean();

      if (!conference) {
        throw new ResourceNotFoundError(`Conference not found for slug: ${req.params.slug}`);
      }

      res.json(successResponse("Conference fetched", serializeConference(conference)));
    })
  );

  app.post(
    "/api/v1/conferences",
    requireRoles(["ADMIN", "ORGANIZER"]),
    asyncHandler(async (req, res) => {
      const payload = normalizeConferencePayload(parseConferenceRequest(req.body));

      const existing = await Conference.findOne({ slug: payload.slug });
      if (existing) {
        throw new ValidationError("Conference slug is already in use");
      }

      const conference = await Conference.create(payload);
      res.status(201).json(successResponse("Conference created", serializeConference(conference)));
    })
  );

  app.put(
    "/api/v1/conferences/:id",
    requireRoles(["ADMIN", "ORGANIZER"]),
    asyncHandler(async (req, res) => {
      if (!mongoose.isValidObjectId(req.params.id)) {
        throw new ResourceNotFoundError(`Conference not found for id: ${req.params.id}`);
      }

      const payload = normalizeConferencePayload(parseConferenceRequest(req.body));
      const conference = await Conference.findById(req.params.id);

      if (!conference) {
        throw new ResourceNotFoundError(`Conference not found for id: ${req.params.id}`);
      }

      const existing = await Conference.findOne({ slug: payload.slug, _id: { $ne: conference._id } });
      if (existing) {
        throw new ValidationError("Conference slug is already in use");
      }

      Object.assign(conference, payload);
      await conference.save();

      res.json(successResponse("Conference updated", serializeConference(conference)));
    })
  );

  app.post(
    "/api/v1/registrations",
    asyncHandler(async (req, res) => {
      const payload = parseRegistrationRequest(req.body);
      const paymentGateway = normalizeRequiredText(payload.paymentGateway).toUpperCase();

      const registration = await ConferenceRegistration.create({
        referenceCode: `REG-${shortCode()}`,
        titlePrefix: normalizeRequiredText(payload.titlePrefix),
        fullName: normalizeRequiredText(payload.fullName),
        email: normalizeRequiredText(payload.email),
        contactNumber: normalizeRequiredText(payload.contactNumber),
        organization: normalizeOptionalText(payload.organization),
        country: normalizeRequiredText(payload.country),
        billingAddress: normalizeRequiredText(payload.billingAddress),
        registrationPhase: normalizeRequiredText(payload.registrationPhase),
        registrationCategory: normalizeRequiredText(payload.registrationCategory),
        registrationAmount: payload.registrationAmount,
        accommodationPackage: normalizeRequiredText(payload.accommodationPackage),
        occupancyType: normalizeRequiredText(payload.occupancyType),
        accommodationAmount: payload.accommodationAmount,
        participantsCount: payload.participantsCount,
        accompanyingPersonsCount: payload.accompanyingPersonsCount,
        accompanyingFee: payload.accompanyingFee,
        taxAmount: payload.taxAmount,
        grandTotal: payload.grandTotal,
        paymentGateway,
        paymentMethod: resolvePaymentMethod(paymentGateway),
        paymentStatus: "CAPTURED",
        paymentOrderId: `order_${shortCode().toLowerCase()}`,
        paymentReceiptId: `rcpt_${shortCode().toLowerCase()}`,
        paymentTransactionId: `pay_${shortCode().toLowerCase()}`,
        currency: "INR"
      });

      res.json(successResponse("Registration submitted successfully", serializeRegistration(registration)));
    })
  );

  app.get(
    "/api/v1/registrations",
    requireRoles(["ADMIN"]),
    asyncHandler(async (_req, res) => {
      const registrations = await ConferenceRegistration.find().sort({ created_at: -1 }).lean();
      res.json(successResponse("Registrations fetched", registrations.map(serializeRegistration)));
    })
  );

  app.post(
    "/api/v1/abstract-submissions",
    abstractUpload.single("file"),
    asyncHandler(async (req, res) => {
      const body = req.body ?? {};
      const requiredFields = [
        "titlePrefix",
        "presentationType",
        "firstName",
        "lastName",
        "email",
        "phone",
        "organization",
        "country",
        "abstractTitle",
        "sessionTrack",
        "abstractText"
      ];

      const validationErrors = {};
      for (const field of requiredFields) {
        if (!String(body[field] ?? "").trim()) {
          validationErrors[field] = "Required field";
        }
      }

      if (Object.keys(validationErrors).length) {
        throw new ValidationError("Validation failed", validationErrors);
      }

      const abstractText = normalizeRequiredText(body.abstractText);
      if (countWords(abstractText) > 300) {
        throw new ValidationError("Abstract text must stay within 300 words.");
      }

      const referenceCode = `ABS-${shortCode()}`;
      const fileUpload = await uploadAbstractFile({
        file: req.file,
        referenceCode
      });

      const submission = await AbstractSubmission.create({
        referenceCode,
        reviewStatus: "SUBMITTED",
        titlePrefix: normalizeRequiredText(body.titlePrefix),
        presentationType: normalizeRequiredText(body.presentationType),
        firstName: normalizeRequiredText(body.firstName),
        lastName: normalizeRequiredText(body.lastName),
        email: normalizeRequiredText(body.email),
        phone: normalizeRequiredText(body.phone),
        organization: normalizeRequiredText(body.organization),
        department: normalizeOptionalText(body.department),
        country: normalizeRequiredText(body.country),
        abstractTitle: normalizeRequiredText(body.abstractTitle),
        sessionTrack: normalizeRequiredText(body.sessionTrack),
        abstractText,
        fileName: fileUpload.fileName,
        fileKey: fileUpload.fileKey,
        fileType: fileUpload.fileType,
        fileSize: fileUpload.fileSize
      });

      res.json(successResponse("Abstract submitted successfully", serializeAbstractSubmission(submission)));
    })
  );

  app.get(
    "/api/v1/abstract-submissions",
    requireRoles(["ADMIN"]),
    asyncHandler(async (_req, res) => {
      const submissions = await AbstractSubmission.find().sort({ created_at: -1 }).lean();
      res.json(successResponse("Abstract submissions fetched", submissions.map(serializeAbstractSubmission)));
    })
  );

  app.get(
    "/api/v1/abstract-submissions/:id/download",
    requireRoles(["ADMIN"]),
    asyncHandler(async (req, res) => {
      if (!mongoose.isValidObjectId(req.params.id)) {
        throw new ResourceNotFoundError("Abstract submission not found");
      }

      const submission = await AbstractSubmission.findById(req.params.id).lean();
      if (!submission) {
        throw new ResourceNotFoundError("Abstract submission not found");
      }

      const fileName = String(submission.fileName ?? "abstract-upload").replace(/"/g, "");
      const contentType = submission.fileType?.trim() || "application/octet-stream";
      const fileBuffer = await downloadFileFromS3(submission.fileKey);

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.send(fileBuffer);
    })
  );

  app.post(
    "/api/files/upload",
    requireAuth,
    managedUpload.single("file"),
    asyncHandler(async (req, res) => {
      const category = String(req.body?.category ?? req.query?.category ?? "").trim();
      if (!category) {
        throw new ValidationError("Missing required request parameter", { error: "category" });
      }

      const response = await uploadManagedFile({
        file: req.file,
        category,
        user: req.user
      });

      res.json(successResponse("File uploaded successfully", response));
    })
  );

  app.delete(
    "/api/files/delete",
    requireAuth,
    asyncHandler(async (req, res) => {
      const objectKey = String(req.query.key ?? "").trim();
      if (!objectKey) {
        throw new ValidationError("Missing required request parameter", { error: "key" });
      }

      await deleteManagedFile(objectKey, req.user);
      res.json(successResponse("File deleted successfully", { key: objectKey }));
    })
  );

  app.get(
    "/api/files/url",
    requireAuth,
    asyncHandler(async (req, res) => {
      const objectKey = String(req.query.key ?? "").trim();
      if (!objectKey) {
        throw new ValidationError("Missing required request parameter", { error: "key" });
      }

      const fileUrl = generateFileUrl(objectKey);
      res.json(successResponse("File URL generated successfully", { fileUrl, key: objectKey }));
    })
  );

  app.post(
    "/api/v1/notifications/campaigns",
    requireRoles(["ADMIN", "ORGANIZER"]),
    (req, res) => {
      res.json(
        successResponse("Campaign queued", {
          queued: true,
          audience: req.body?.audience ?? "all-subscribers"
        })
      );
    }
  );

  app.get(
    "/api/v1/payments/monitoring",
    requireRoles(["ADMIN", "ORGANIZER"]),
    (_req, res) => {
      res.json(
        successResponse("Payment monitoring snapshot", [
          {
            conference: "World Summit on Precision Oncology",
            status: "SETTLED",
            amount: 28450
          },
          {
            conference: "AI in Clinical Decision Systems Congress",
            status: "PENDING",
            amount: 12780
          }
        ])
      );
    }
  );

  app.get(
    "/api/v1/site-settings/home-hero",
    asyncHandler(async (_req, res) => {
      res.json(successResponse("Home hero settings fetched", await readSingleton(HomeHeroSettings, "home-hero", defaultHomeHeroSettings)));
    })
  );

  app.put(
    "/api/v1/site-settings/home-hero",
    requireRoles(["ADMIN"]),
    asyncHandler(async (req, res) => {
      const payload = parseHomeHeroSettingsRequest(req.body);
      res.json(successResponse("Home hero settings updated", await writeSingleton(HomeHeroSettings, "home-hero", payload)));
    })
  );

  app.get(
    "/api/v1/site-settings/agenda",
    asyncHandler(async (_req, res) => {
      res.json(successResponse("Agenda settings fetched", await readSingleton(AgendaSettings, "agenda", defaultAgendaSettings)));
    })
  );

  app.put(
    "/api/v1/site-settings/agenda",
    requireRoles(["ADMIN"]),
    asyncHandler(async (req, res) => {
      const payload = parseAgendaSettingsRequest(req.body);
      res.json(successResponse("Agenda settings updated", await writeSingleton(AgendaSettings, "agenda", payload)));
    })
  );

  app.get(
    "/api/v1/site-settings/speakers",
    asyncHandler(async (_req, res) => {
      res.json(successResponse("Speakers settings fetched", await readSingleton(SpeakersSettings, "speakers", defaultSpeakersSettings)));
    })
  );

  app.put(
    "/api/v1/site-settings/speakers",
    requireRoles(["ADMIN"]),
    asyncHandler(async (req, res) => {
      const payload = parseSpeakersSettingsRequest(req.body);
      res.json(successResponse("Speakers settings updated", await writeSingleton(SpeakersSettings, "speakers", payload)));
    })
  );

  app.get(
    "/api/v1/site-settings/committee",
    asyncHandler(async (_req, res) => {
      res.json(successResponse("Committee settings fetched", await readSingleton(CommitteeSettings, "committee", defaultCommitteeSettings)));
    })
  );

  app.put(
    "/api/v1/site-settings/committee",
    requireRoles(["ADMIN"]),
    asyncHandler(async (req, res) => {
      const payload = parseCommitteeSettingsRequest(req.body);
      res.json(successResponse("Committee settings updated", await writeSingleton(CommitteeSettings, "committee", payload)));
    })
  );

  app.get(
    "/api/v1/site-settings/downloads",
    asyncHandler(async (_req, res) => {
      res.json(successResponse("Downloads settings fetched", await readSingleton(DownloadsSettings, "downloads", defaultDownloadsSettings)));
    })
  );

  app.put(
    "/api/v1/site-settings/downloads",
    requireRoles(["ADMIN"]),
    asyncHandler(async (req, res) => {
      const payload = parseDownloadsSettingsRequest(req.body);
      res.json(successResponse("Downloads settings updated", await writeSingleton(DownloadsSettings, "downloads", payload)));
    })
  );

  app.get(
    "/api/v1/site-settings/content",
    asyncHandler(async (_req, res) => {
      res.json(successResponse("Content settings fetched", await readSingleton(ContentSettings, "core-content", defaultContentSettings)));
    })
  );

  app.put(
    "/api/v1/site-settings/content",
    requireRoles(["ADMIN"]),
    asyncHandler(async (req, res) => {
      const payload = parseContentSettingsRequest(req.body);
      res.json(successResponse("Content settings updated", await writeSingleton(ContentSettings, "core-content", payload)));
    })
  );

  app.use((_req, _res, next) => {
    next(new ResourceNotFoundError("Resource not found"));
  });

  app.use((error, req, res, _next) => {
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      const message = req.originalUrl.includes("/abstract-submissions")
        ? "Maximum file size is 5 MB."
        : "Uploaded file exceeds the configured 50MB limit";

      const appError = new PayloadTooLargeError(message);

      res.status(appError.statusCode).json(failureResponse(appError.message, appError.data));
      return;
    }

    if (error instanceof SyntaxError && "body" in error) {
      res.status(400).json(failureResponse("Validation failed", { error: "Invalid JSON payload" }));
      return;
    }

    if (error?.code === 11000) {
      const duplicatedField = Object.keys(error.keyPattern ?? {})[0] ?? "field";
      const message = duplicatedField === "email"
        ? "Email is already registered"
        : duplicatedField === "slug"
          ? "Conference slug is already in use"
          : `${duplicatedField} must be unique`;

      res.status(400).json(failureResponse(message, { error: "INVALID_REQUEST" }));
      return;
    }

    if (error instanceof AppError) {
      res.status(error.statusCode).json(failureResponse(error.message, error.data));
      return;
    }

    if (error?.message === "Not allowed by CORS") {
      res.status(403).json(failureResponse("Access denied", { error: error.message }));
      return;
    }

    res.status(500).json(failureResponse("Unexpected server error", { error: error?.message ?? "Unknown error" }));
  });

  return app;
}
