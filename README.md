# Ventolivo WebService

Ventolivo is a multilingual e-commerce storefront for an artisan soap brand, built with Next.js 16 App Router. The application supports multiple languages (English, Turkish, German, Persian, Arabic) with RTL support, an admin panel, and a layered architecture centered on `app -> services -> modules`.

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Database | SQLite via Prisma ORM |
| Testing | Vitest + Testing Library + Playwright |
| Error Tracking | Sentry |
| Containerization | Docker + Docker Compose |

## Project Structure

```text
ventolivo/
|- app/          # Routes, server actions, API handlers
|- components/   # UI building blocks and sections
|- config/       # Static configuration
|- db/           # Prisma persistence adapters
|- hooks/        # React hooks
|- i18n/         # Locale dictionaries and helpers
|- lib/          # Shared utilities and validations
|- modules/      # Domain/application/infrastructure modules
|- public/       # Static assets
|- services/     # App-facing orchestration layer
|- stores/       # Client-side state
|- test/         # Test setup and e2e assets
`- types/        # Shared TypeScript types
```

## Architecture

The project follows a layered architecture:

1. `app` and server-facing components call `services`
2. `services` orchestrate application use cases
3. `modules` hold domain, application, and infrastructure logic
4. `db` and storage adapters provide persistence details

```text
App / Components -> Services -> Modules -> DB / Storage
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run Playwright tests |
| `npm run ci:check` | Run formatting, lint, typecheck, db validation, and coverage |

## Environment

Create a `.env` file with the values you need:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=

DATABASE_URL=file:./dev.db
PRODUCTS_DATA_SOURCE=mock
MEDIA_STORAGE_DRIVER=local
MEDIA_LOCAL_UPLOAD_DIR=public/uploads/media
MEDIA_PUBLIC_BASE_PATH=/uploads/media
MEDIA_S3_ENDPOINT=
MEDIA_S3_REGION=us-east-1
MEDIA_S3_BUCKET=
MEDIA_S3_ACCESS_KEY_ID=
MEDIA_S3_SECRET_ACCESS_KEY=
MEDIA_S3_PUBLIC_BASE_URL=
MEDIA_S3_FORCE_PATH_STYLE=true
MEDIA_S3_KEY_PREFIX=media

ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=

LIBRETRANSLATE_URL=
LIBRETRANSLATE_API_KEY=
RATE_LIMIT_DRIVER=database
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_MEDIA_UPLOADS=10
RATE_LIMIT_MAX_TRANSLATION_REQUESTS=20
```

## Quality Gates

- TypeScript runs in strict mode
- ESLint uses a dedicated flat config in `eslint.config.mjs`
- Prettier uses `.prettierrc.json`
- App-layer imports are guarded so `app/` consumes `services/`, not `modules/`
- Sensitive admin routes include request tracing and configurable memory/database-backed rate limiting
- Media uploads support local disk or S3-compatible object storage behind the same abstraction
- CI runs lint, typecheck, coverage, build, Docker build, and e2e smoke checks

## Deployment

The project ships with:

- `Dockerfile` for standalone production builds
- `docker-compose.yml` for local production-like runs
- GitHub Actions workflows in `.github/workflows/`
