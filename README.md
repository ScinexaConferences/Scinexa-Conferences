# Scinexa Conferences

Scinexa Conferences is a monorepo scaffold for a premium conference discovery and management platform inspired by the business breadth of Matrix Conferences, but redesigned as an original SaaS product.

## What is included

- `apps/web`: React + Vite + Tailwind frontend with public pages, dashboard shells, reusable components, theme switching, and mock content.
- `apps/api`: Node.js + Express + MongoDB backend with JWT auth, conference APIs, admin-facing endpoints, file uploads, and layered route handling.
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
npm install
npm run dev:api
```

The backend expects:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`

Default local MongoDB connection used in this repo:

```text
mongodb://localhost:27017/scinexa_conferences
```

If you want to use MongoDB Atlas, set `MONGODB_URI` inside `.env` before starting the backend:

```bash
export MONGODB_URI='mongodb+srv://<db-user>:<db-password>@<cluster-host>/scinexa_conferences?retryWrites=true&w=majority&tls=true&authSource=admin&appName=<cluster-name>'
```

Notes:

- If your database password contains `@`, encode it as `%40` inside the Mongo URI.
- Atlas must allow your current IP address in `Network Access`.
- The Atlas database user must exist and have access to the cluster.
- If Atlas still returns an SSL handshake error, verify the cluster is active and that your network/firewall is not blocking outbound TLS to MongoDB Atlas.

### Environment file

You can configure the backend from either of these files:

- repo-wide: `.env`
- backend-only override: `apps/api/.env`

The API loads the repo root file first and then lets `apps/api/.env` override it when present. Docker Compose continues reading the repo root `.env`.

### File uploads

All uploaded files now go to AWS S3, including:

- admin-managed images and documents
- abstract submission attachments

MongoDB stores only text content and file metadata records. Configure these before using upload buttons or abstract file submissions:

```bash
export AWS_REGION='ap-south-1'
export AWS_BUCKET_NAME='your-s3-bucket-name'
export AWS_ACCESS_KEY='your-access-key'
export AWS_SECRET_KEY='your-secret-key'
```

If `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` are omitted, the backend falls back to the default AWS credentials provider chain.

### Local development admin

When the backend starts, it seeds a local admin account by default.

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
