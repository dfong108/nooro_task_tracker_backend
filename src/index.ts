import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow CORS for our Task Tracker frontend at http://localhost:3000
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigin = 'http://localhost:3000';
  const origin = req.headers.origin;

  if (origin === allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
    // Enable if you plan to send cookies/authorization headers cross-origin
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status =
    err && typeof err === 'object' && 'status' in err ? (err as any).status : 500;
  const message =
    err instanceof Error ? err.message : 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({ error: message });
});

const PORT = Number(process.env.PORT || 4000);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;