# Ventolivo WebService

Ventolivo is a multilingual Next.js storefront for an artisan soap brand. The codebase is organized so the app can grow from a content-first site into a database-backed product catalog without rewriting route logic.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript with strict mode
- Tailwind CSS 4
- Vitest + Testing Library
- Prisma for database-backed product storage

## Project Structure

- `app/`: routes, layouts, metadata, and API handlers
- `components/`: UI, layout, sections, and product components
- `config/`: site-level configuration and navigation constants
- `data/`: mock content for static and local usage
- `db/`: Prisma client and database adapters
- `i18n/`: locale config and dictionaries
- `lib/`: validation, SEO, env parsing, and shared utilities
- `modules/`: feature-oriented domain modules and mapping logic
- `repositories/`: runtime data-source selection
- `services/`: app-facing business layer
- `types/`: shared TypeScript contracts

## Product Data Flow

All pages and API routes read products through `services/products.ts`.

`services/products.ts` is kept as a stable compatibility entrypoint and delegates into the `modules/products/` domain module.

The product module uses `repositories/products.ts`, which selects a single runtime source:

- `mock`: reads from `data/products.ts`
- `database`: reads from Prisma adapters in `db/`

This keeps route logic stable while the data source evolves.

Inside `modules/products/`, shared product mapping and normalization rules are centralized so `mock` and `database` data sources behave consistently.

## Environment Variables

Copy `.env.example` into your local environment and adjust values as needed.

- `NEXT_PUBLIC_SITE_URL`: canonical site URL
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: number used in WhatsApp deep links
- `NEXT_PUBLIC_GA_ID`: optional analytics identifier
- `NEXT_PUBLIC_SENTRY_DSN`: optional Sentry DSN
- `DATABASE_URL`: Prisma database connection string
- `PRODUCTS_DATA_SOURCE`: `mock` or `database`

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test:run
npm run build
```

## Architecture Notes

- Locale validation is enforced at route boundaries.
- Environment variables are parsed before runtime use.
- API routes and pages share the same service layer.
- Prisma remains optional until `PRODUCTS_DATA_SOURCE=database` is enabled.
