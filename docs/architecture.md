# Platform Architecture

## Product shape

The platform is structured as a reusable event engine rather than a single conference website. That means:

- multi-conference support from day one
- clear separation between public experiences, attendee features, organizer workflows, and platform administration
- data and service boundaries that can later support microservice extraction

## Monorepo layout

```text
apps/
  api/   Node.js + Express backend
  web/   React frontend
docs/    Architecture and database references
infra/   Deployment assets
```

## Frontend architecture

- `layouts/`: shared application shell
- `pages/`: route-level screens
- `components/`: reusable UI building blocks
- `data/`: placeholder fixtures until API wiring is complete
- `services/`: Axios clients and future API adapters
- `store/`: Redux Toolkit state
- `routes/`: router configuration
- `utils/`: formatting helpers

## Backend architecture

The API is now organized around an Express service structure:

- `server/index.js`: startup and Mongo bootstrap
- `server/app.js`: route registration and middleware
- `server/models.js`: Mongoose models
- `server/auth.js`: JWT auth and role guards
- `server/validators.js`: request validation
- `server/storage.js`: S3 upload helpers
- `server/defaults.js`: default CMS-style content payloads
- `server/config.js`: env loading and runtime config

## Planned domain modules

- `auth`
- `users`
- `conferences`
- `sessions`
- `speakers`
- `tickets`
- `payments`
- `abstracts`
- `reviews`
- `sponsors`
- `blogs`
- `notifications`
- `analytics`
- `cms`
- `certificates`

## Recommended evolution path

### Phase 1

- public marketing site
- conference listing and details
- attendee registration
- basic authentication

### Phase 2

- conference authoring and approval workflow
- speaker and session management
- payments and invoicing
- abstract submission

### Phase 3

- analytics dashboards
- email campaigns
- CMS and SEO management
- sponsor and exhibitor operations

### Phase 4

- AI recommendations
- AI abstract review support
- networking/chat
- live streaming and webinar integrations
- PWA and mobile app surfaces
