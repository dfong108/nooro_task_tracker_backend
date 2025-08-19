# Nooro Task Tracker Backend
A TypeScript-based REST API powered by Node.js, Express, and Prisma.
## Tech Stack
- Node.js + TypeScript
- Express
- Prisma ORM
- npm for package management

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+
- A SQL database (e.g., PostgreSQL). Provide a connection string via environment variables.

## Quick Start
1. Install dependencies
``` bash
npm install
```
1. Configure environment Create a .env file in the project root:
``` dotenv
# HTTP server
PORT=3000

# Prisma connection string (example for PostgreSQL)
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=public"
```
1. Set up the database with Prisma
``` bash
# Generate Prisma Client
npm run db:generate || npx prisma generate

# Apply migrations in development
npm run db:migrate || npx prisma migrate dev
```
1. Run the server

- Development (auto-reload):
``` bash
npm run dev
```
- Production:
``` bash
npm run build
npm run start
```
1. Explore your data (optional)
``` bash
npm run db:studio || npx prisma studio
```
## Available npm Scripts
- Development:
``` bash
npm run dev
```
- Build TypeScript:
``` bash
npm run build
```
- Start production build:
``` bash
npm run start
```
- Type-check only:
``` bash
npm run typecheck
```
- Prisma tasks:
``` bash
npm run db:generate   # prisma generate
npm run db:migrate    # prisma migrate dev
npm run db:deploy     # prisma migrate deploy (CI/prod)
npm run db:push       # prisma db push (no migrations)
npm run db:studio     # prisma studio
```
If any of the above scripts are missing in your package.json, you can add them quickly:
``` bash
npm pkg set scripts.dev="tsx watch src/index.ts"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.typecheck="tsc --noEmit"
npm pkg set scripts.db:generate="prisma generate"
npm pkg set scripts.db:migrate="prisma migrate dev"
npm pkg set scripts.db:deploy="prisma migrate deploy"
npm pkg set scripts.db:push="prisma db push"
npm pkg set scripts.db:studio="prisma studio"
```
## Configuration
- PORT: HTTP port (defaults to 3000 if not set)
- DATABASE_URL: Connection string for your database (use your own secure values; do not commit secrets)

## Troubleshooting
- Authentication errors when pushing to GitHub:
    - Ensure the correct account is active in GitHub CLI:
``` bash
    gh auth status
    gh auth setup-git
```
- Verify your remote URL points to the correct repository:
``` bash
    git remote -v
```
- Prisma errors:
    - Regenerate client after schema changes:
``` bash
    npm run db:generate
```
- Apply or reapply migrations:
``` bash
    npm run db:migrate
```
- TypeScript build issues:
    - Run a type-only check:
``` bash
    npm run typecheck
```
## Scripts in CI/CD (example)
- Install: npm ci
- Generate client: npm run db:generate
- Deploy migrations: npm run db:deploy
- Build: npm run build
- Start: npm run start
