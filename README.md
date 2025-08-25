# Nooro Task Tracker Backend
A TypeScript-based REST API powered by Node.js, Express, and Prisma.
## Tech Stack
- Node.js + TypeScript
- Express
- Prisma ORM with MySQL
- Docker (for local MySQL database)
- npm for package management

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+
- Docker and Docker Compose (for running the MySQL database locally)

## Quick Start
1. Install dependencies
``` bash
npm install
```
2. Configure environment
   Create a `.env` file in the project root with the following contents:

```dotenv
# Database configuration for Docker
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=todo_app
MYSQL_USER=todouser
MYSQL_PASSWORD=todopass

# Prisma database connection URL (MySQL)
DATABASE_URL=mysql://todouser:todopass@localhost:3306/todo_app

# HTTP server
PORT=4000
```

> **Note:** For a real production environment, you should use strong, unique passwords.

3. Run the application

This project is configured for a streamlined development experience. Just run:

```bash
npm run dev
```

This single command will:
- Start the MySQL container
- Wait for the database to be ready
- Generate the Prisma client
- Set up the database schema
- Start the development server with auto-reload

Alternatively, if you want to set up the database separately:

```bash
npm run setup  # Sets up the database and generates code
npm run dev    # Starts the development server
```

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
npm run dev         # Starts everything (DB, Prisma, server) in one command
```
- Database Setup:
``` bash
npm run setup       # Sets up DB, generates Prisma client, and pushes schema
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

### Environment Variables
- `PORT`: HTTP port (defaults to 4000 if not set)
- `DATABASE_URL`: Connection string for your MySQL database
- `MYSQL_ROOT_PASSWORD`: Root password for MySQL container
- `MYSQL_DATABASE`: Database name for MySQL
- `MYSQL_USER`: Username for MySQL
- `MYSQL_PASSWORD`: Password for MySQL user

### Docker Configuration
The project includes a `docker-compose.yml` file that sets up a MySQL 8.0 container with the following configuration:

- Port: 3306 (default MySQL port)
- Data persistence through a named volume
- Health checks to ensure the database is ready before application startup

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

- Docker and MySQL issues:
    - Check if MySQL container is running:
```bash
    docker compose ps
```
    - View MySQL container logs:
```bash
    docker compose logs db
```
    - Restart the MySQL container:
```bash
    docker compose restart db
```
    - Reset everything (will delete all data):
```bash
    npm run reset
```

- Database authentication issues:
  If you see an error like "Authentication failed against database server", try these steps:
  1. Verify your .env file has the correct database credentials
  2. Reset everything with `npm run reset`
  3. Check MySQL logs with `docker compose logs db`
  4. Try connecting manually to verify credentials:
```bash
     docker compose exec db mysql -utodouser -ptodopass -h127.0.0.1 todo_app
```
## Scripts in CI/CD (example)
- Install: npm ci
- Generate client: npm run db:generate
- Deploy migrations: npm run db:deploy
- Build: npm run build
- Start: npm run start
