# Platform Architecture

## Product shape

The platform is structured as a reusable event engine rather than a single conference website. That means:

- multi-conference support from day one
- clear separation between public experiences, attendee features, organizer workflows, and platform administration
- data and service boundaries that can later support microservice extraction

## Monorepo layout

```text
apps/
  api/   Spring Boot backend
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

The API follows a layered pattern:

- `controller`: request/response boundary
- `service`: business logic
- `repository`: persistence access
- `dto`: API contracts
- `entity`: MongoDB documents
- `mapper`: MapStruct model translation
- `common`: cross-cutting concerns like config, errors, and response wrappers
- `security`: JWT and authorization

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

