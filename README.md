# Scinexa Conferences

Scinexa Conferences is a monorepo scaffold for a premium conference discovery and management platform inspired by the business breadth of Matrix Conferences, but redesigned as an original SaaS product.

## What is included

- `apps/web`: React + Vite + Tailwind frontend with public pages, dashboard shells, reusable components, theme switching, and mock content.
- `apps/api`: Spring Boot 3 + Java 21 + MongoDB backend scaffold with JWT auth, conference APIs, admin-facing endpoints, Swagger, and layered architecture.
- `docs`: architecture and MongoDB design notes for future implementation phases.
- `infra`: Docker, nginx, and deployment helpers.

## Frontend pages

- Home
- Conferences listing
- Conference details
- Speakers
- Agenda
- Registration
- Blog
- About
- Contact
- Sponsors
- User dashboard
- Admin dashboard

## Backend modules scaffolded

- Authentication
- Users
- Conferences
- Dashboard
- Notifications
- Payments

The remaining modules from your roadmap, such as abstracts, reviews, tickets, speakers, sessions, CMS, analytics, certificates, and sponsors, are laid out in the architecture docs and can be added into the same structure.

## Getting started

### Frontend

```bash
npm install
npm run dev:web
```

### Backend

```bash
mvn -f apps/api/pom.xml spring-boot:run
```

The backend expects:

- `MONGODB_URI`
- `JWT_SECRET`

### Local development admin

When the backend starts, it now seeds a local admin account by default.

- Email: `admin@scinexa.local`
- Password: `Admin@12345`

You can override or disable it with:

- `DEV_ADMIN_ENABLED`
- `DEV_ADMIN_FULL_NAME`
- `DEV_ADMIN_EMAIL`
- `DEV_ADMIN_PASSWORD`
- `DEV_ADMIN_RESET_PASSWORD_ON_STARTUP`

## Product direction

This scaffold is optimized for the roadmap you outlined:

1. Public conference discovery and registration
2. Organizer and admin operations
3. Analytics, CMS, and notifications
4. AI-assisted workflows and marketplace-ready multi-event expansion
