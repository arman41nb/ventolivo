# Ventolivo WebService

Ventolivo is a multilingual e-commerce storefront for an artisan soap brand, built with Next.js 16 App Router. The application supports multiple languages (English, Turkish, German, Persian, Arabic) with full RTL support, and features a flexible architecture that allows switching between mock data and database-backed product storage.

## Tech Stack

| Category | Technology |
|----------|-------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Database | SQLite via Prisma ORM |
| Testing | Vitest + Testing Library |
| Error Tracking | Sentry |
| Internationalization | next-intl compatible approach |
| Containerization | Docker + Docker Compose |

## Features

### Core Functionality
- **Multilingual Support**: 5 languages (EN, TR, DE, FA, AR) with RTL support for Persian and Arabic
- **Product Catalog**: Dynamic product listing with filtering and search capabilities
- **Product Details**: Detailed product pages with images, descriptions, and translations
- **Featured Products**: Homepage featured products section
- **Responsive Design**: Mobile-first design using Tailwind CSS

### Content Management
- **Admin Dashboard**: Manage products, media assets, and site content
- **Site Content Editor**: Visual editing of homepage content (Hero, CTA, Footer, etc.)
- **Product Management**: Create, update, delete products with full translation support
- **Media Library**: Upload and manage product images and videos

### Technical Features
- **Dual Data Source**: Switch between mock data and database without changing route logic
- **Type Safety**: Full TypeScript support with strict mode enabled
- **API Routes**: RESTful API endpoints for products
- **Error Tracking**: Sentry integration for both client and server
- **Testing**: Unit and integration tests with Vitest

## Project Structure

```
ventolivo/
├── app/                    # Next.js App Router pages and API routes
│   ├── [locale]/          # Locale-based routes (homepage, products, admin)
│   └── api/               # API routes (products)
├── components/            # React components
│   ├── admin/             # Admin panel components
│   ├── layout/            # Layout components (Navbar, Footer)
│   ├── products/          # Product-related components
│   ├── sections/         # Page sections (Hero, Features, etc.)
│   └── ui/                # Reusable UI components
├── config/                # Site configuration and navigation
├── db/                    # Prisma client and database operations
├── hooks/                 # Custom React hooks
├── i18n/                  # Internationalization (locales, dictionaries)
├── lib/                   # Utilities (validations, SEO, env parsing)
├── modules/               # Domain modules (products, admin, media, site-content)
├── pages/                 # Alternative pages (deprecated, using app/)
├── public/               # Static assets
├── repositories/          # Data source abstraction layer
├── services/              # Business logic layer
├── stores/                # Client-side state management
├── test/                  # Test setup and utilities
└── types/                 # TypeScript type definitions
```

### Architecture Pattern

The project follows a layered architecture:

1. **Components**: React UI components
2. **Services**: Business logic entry points (`services/products.ts`)
3. **Modules**: Domain-specific logic
4. **Repositories**: Data source abstraction (mock vs database)
5. **DB**: Prisma database operations

```
Pages/Components → Services → Modules → Repositories → Mock/DB
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
cd ventolivo
npm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=+905551234567
NEXT_PUBLIC_GA_ID=

# Optional Error Tracking
NEXT_PUBLIC_SENTRY_DSN=

# Database
DATABASE_URL=file:./dev.db

# Data Source Selection
# Options: "mock" | "database"
PRODUCTS_DATA_SOURCE=mock
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Create initial migration
npx prisma migrate dev --name init
```

## Data Source Switching

The application supports two data sources:

### Mock Data (Default)
- Data stored in `data/products.ts`
- No database required
- Suitable for development and prototyping

### Database
- Prisma with SQLite backend
- Set `PRODUCTS_DATA_SOURCE=database` in environment
- Full CRUD operations supported

To switch to database:
```bash
# Add to .env
PRODUCTS_DATA_SOURCE=database
```

## Docker Deployment

### Build and Run

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Dockerfile Features
- Multi-stage build for optimized image size
- Standalone output for production
- Non-root user for security

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports `tag`, `featured`, `limit`, `locale` params) |
| GET | `/api/products/[slug]` | Get single product by slug |

Example:
```bash
curl "http://localhost:3000/api/products?featured=true&limit=4"
```

## Internationalization

### Supported Languages

| Code | Language | Direction |
|------|----------|-----------|
| en | English | LTR |
| tr | Turkish | LTR |
| de | German | LTR |
| fa | Persian | RTL |
| ar | Arabic | RTL |

### Dictionary Structure

Translation files are located in `i18n/dictionaries/`:
- `en.json`
- `tr.json`
- `de.json`
- `fa.json`
- `ar.json`

## Admin Panel

Access admin at `/[locale]/admin` (e.g., `/en/admin`).

Features:
- Dashboard with statistics
- Product management (CRUD)
- Site content editing
- Media library
- Session management

## Testing

```bash
# Run all tests
npm run test:run

# Run with coverage
npm run test:coverage

# Watch mode
npm run test
```

## Project Conventions

- **TypeScript**: Strict mode enabled, all files must be type-safe
- **Components**: Use functional components with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Naming**: PascalCase for components, camelCase for variables
- **Paths**: Use `@/` alias for imports (configured in tsconfig.json)

## License

Private - All rights reserved
