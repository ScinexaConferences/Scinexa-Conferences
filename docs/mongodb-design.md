# MongoDB Design

## Core collections

- `users`
- `roles`
- `conferences`
- `sessions`
- `speakers`
- `venues`
- `tickets`
- `payments`
- `blogs`
- `categories`
- `sponsors`
- `notifications`
- `abstracts`
- `reviews`
- `certificates`
- `settings`
- `banners`

## Example conference document

```json
{
  "_id": "665f8d0aafbe8b9d36ad1101",
  "slug": "world-summit-on-precision-oncology",
  "title": "World Summit on Precision Oncology",
  "category": "Medical Sciences",
  "shortDescription": "A premium oncology forum connecting researchers and clinicians.",
  "venueName": "Marina Bay Convention Centre",
  "city": "Singapore",
  "country": "Singapore",
  "startDate": "2026-09-18",
  "endDate": "2026-09-20",
  "ticketPriceFrom": 499,
  "tracks": ["Immunotherapy", "Radiomics"],
  "keywords": ["oncology", "precision medicine"],
  "status": "PUBLISHED",
  "featured": true,
  "createdAt": "2026-05-20T09:00:00Z",
  "updatedAt": "2026-05-20T09:00:00Z"
}
```

## Example user document

```json
{
  "_id": "665f8d0aafbe8b9d36ad2201",
  "fullName": "Dr. Maya Chen",
  "email": "maya@example.org",
  "passwordHash": "$2a$10$...",
  "roles": ["ATTENDEE", "SPEAKER"],
  "active": true,
  "savedConferenceIds": ["world-summit-on-precision-oncology"],
  "createdAt": "2026-05-20T09:00:00Z",
  "updatedAt": "2026-05-20T09:00:00Z"
}
```

## Relationship strategy

- Use references between collections for high-cardinality associations such as `speakerIds`, `sessionIds`, and `registrationIds`.
- Embed small immutable snapshots where read performance matters, such as ticket holder display names or sponsor tier names at purchase time.
- Store workflow status directly on documents for approval, review, and publication pipelines.

## Indexing strategy

- `users.email`: unique index
- `conferences.slug`: unique index
- `conferences.status + category + startDate`: compound index
- `sessions.conferenceId + startTime`
- `speakers.conferenceIds`
- `tickets.userId + conferenceId`
- `payments.conferenceId + status + createdAt`
- `abstracts.conferenceId + reviewStatus + submittedAt`
- `blogs.slug`: unique index
- text index on `conferences.title`, `conferences.shortDescription`, and `blogs.title`

## Aggregation examples

- registrations by conference and month
- revenue by currency, conference, and payment status
- abstract acceptance rate by conference and track
- sponsor contribution totals by package tier
- attendee geography breakdown from registration profiles

## Scalability notes

- Keep event files such as brochures, certificates, and abstracts in object storage rather than inside MongoDB.
- Add Redis caching for public conference listing pages and dashboard metrics.
- Introduce tenant or organization identifiers once the platform expands to multi-brand conference operations.
- Keep collections audit-friendly with `createdAt`, `updatedAt`, and status history fields.

