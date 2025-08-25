# Nooro Task Tracker Backend

A robust and modern task management API built with TypeScript, Express, and Prisma ORM. This project demonstrates best practices for building a production-ready RESTful API with a focus on code quality, error handling, and developer experience.

## Project Overview

The Nooro Task Tracker is a full-featured task management system that allows users to create, read, update, and delete tasks. Key features include:

- **Task Management**: Create, retrieve, update, and delete tasks
- **Task Attributes**: Each task includes a title, color category, and completion status
- **Task Organization**: Tasks are automatically ordered by creation date
- **Completion Tracking**: Toggle task completion status via dedicated endpoints

## Tech Stack

- **Language**: TypeScript 5.9+ with strict type checking
- **Runtime**: Node.js 18+ (LTS recommended)
- **Web Framework**: Express 5.0 with middleware-based architecture
- **Database**: MySQL via Prisma ORM for type-safe database access
- **Development Environment**: Docker for local database deployment
- **Package Management**: npm for dependency management
- **API Documentation**: RESTful API with JSON responses

## Architecture

The application follows a clean, layered architecture:

- **Controllers**: Business logic and database interaction
- **Routes**: HTTP endpoint definitions and request handling
- **Models**: Prisma schema defining the database structure
- **Utilities**: Validation, error handling, and helper functions
- **Middleware**: Request processing, logging, and error handling

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks, sorted by most recent first |
| GET | `/api/tasks/:id` | Get a specific task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task's properties |
| PATCH | `/api/tasks/:id/complete` | Toggle a task's completion status |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/health` | Health check endpoint |

## Data Model

The core Task model includes:

- `id`: Unique identifier (CUID)
- `title`: Task title (string, required)
- `color`: Color category (enum: RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, PURPLE, PINK, BROWN)
- `completed`: Completion status (boolean)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Docker and Docker Compose (for local development with MySQL)
- A code editor with TypeScript support (VS Code recommended)

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/nooro-task-tracker.git
cd nooro-task-tracker
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your database connection details
```

4. Start the MySQL database with Docker

```bash
docker-compose up -d
```

5. Run database migrations

```bash
npx prisma migrate dev
```

6. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:4000`.

## Usage

### Example: Creating a Task

```bash
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete project documentation","color":"BLUE"}'
```

Response:

```json
{
  "data": {
    "id": "cmequnw6j00018c477ye050gp",
    "title": "Complete project documentation",
    "color": "BLUE",
    "completed": false,
    "createdAt": "2025-08-25T12:34:56.789Z",
    "updatedAt": "2025-08-25T12:34:56.789Z"
  }
}
```

### Example: Toggling Task Completion

```bash
curl -X PATCH http://localhost:4000/api/tasks/cmequnw6j00018c477ye050gp/complete \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

Response:

```json
{
  "data": {
    "id": "cmequnw6j00018c477ye050gp",
    "title": "Complete project documentation",
    "color": "BLUE",
    "completed": true,
    "createdAt": "2025-08-25T12:34:56.789Z",
    "updatedAt": "2025-08-25T12:35:10.123Z"
  }
}
```

## Project Structure

```
├── prisma/                 # Prisma schema and migrations
│   ├── schema.prisma      # Database schema definition
│   └── generated/         # Prisma client generated code
├── src/
│   ├── controllers/       # Business logic layer
│   │   └── index.ts       # Task operations (create, update, delete, etc.)
│   ├── prisma/            # Database client initialization
│   │   └── client.ts      # Prisma client singleton
│   ├── routes/            # API route definitions
│   │   └── index.ts       # API endpoints for tasks
│   ├── utils/             # Utility functions
│   │   └── validators.ts  # Input validation helpers
│   └── index.ts           # Application entry point
├── .env                    # Environment variables
├── docker-compose.yml      # Docker configuration for local DB
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Development

### Available Scripts

- `npm run dev`: Start the development server with hot reloading
- `npm run build`: Build the project for production
- `npm start`: Run the production build
- `npm run lint`: Run ESLint to check code quality
- `npm run format`: Format code with Prettier
- `npm test`: Run test suite

### Environment Variables

The following environment variables can be configured in the `.env` file:

- `PORT`: API server port (default: 4000)
- `DATABASE_URL`: MySQL connection string
- `NODE_ENV`: Environment (development, test, production)

## Testing

This project includes several test utilities to verify API functionality:

- `test-complete.js`: Test script for task completion functionality
- `test-update.js`: Test script for task update operations

Run a test with Node.js:

```bash
node test-complete.js TASK_ID
```

## Error Handling

The API uses consistent error responses with appropriate HTTP status codes:

- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side errors

Example error response:

```json
{
  "error": "Task with id \"invalid-id\" not found."
}
```

## API Response Format

All API responses follow a consistent structure:

### Success Responses

Success responses include a `data` property containing the requested resource(s):

```json
{
  "data": { ... }
}
```

### Error Responses

Error responses include an `error` property with a descriptive message:

```json
{
  "error": "Error message"
}
```

## Security Considerations

This API implements several security best practices:

- **Input Validation**: All user inputs are validated before processing
- **Error Handling**: Errors are handled gracefully without exposing sensitive information
- **CORS Configuration**: Cross-Origin Resource Sharing is configured to allow requests only from trusted origins
- **Content-Type Validation**: Requests are validated for proper content types
- **Rate Limiting**: API endpoints are protected against abuse (configurable)

## Deployment

The application is designed to be deployed to any Node.js hosting environment:

1. Build the application: `npm run build`
2. Set up environment variables in your hosting platform
3. Start the application: `npm start`

## Future Enhancements

- User authentication and authorization
- Task categories and tags
- Task deadlines and reminders
- Pagination for large task lists
- Full-text search functionality
- WebSocket support for real-time updates

## Conclusion

This project demonstrates a modern approach to building a robust RESTful API using TypeScript, Express, and Prisma. It showcases clean architecture, error handling, validation, and other best practices for professional backend development.

## License

MIT
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
