import 'dotenv/config'; // Load environment variables first
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

// Use body-parser directly for more control over parsing
app.use(bodyParser.json({
  limit: '10mb',
  type: function(req) {
    const contentType = req.headers['content-type'] || '';
    return contentType.includes('application/json');
  }
}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Add raw body parser for debugging
app.use(bodyParser.raw({ type: '*/*', limit: '10mb' }));

// Manual JSON parsing middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.body || (typeof req.body === 'object' && Object.keys(req.body).length === 0)) {
    // If body is empty and we have a raw body, try to parse it
    if (req.body instanceof Buffer) {
      try {
        const rawBody = req.body.toString('utf8');
        console.log('Raw body:', rawBody);
        if (rawBody) {
          req.body = JSON.parse(rawBody);
          console.log('Manually parsed body:', req.body);
        }
      } catch (err) {
        console.error('Error parsing raw body:', err);
      }
    }
  }
  next();
});

// Body parsing error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('JSON Parse Error:', err);
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next(err);
});

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.method !== 'OPTIONS') {
    console.log(`${req.method} ${req.path}`, {
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }
  next();
});

// Handle proxied requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  // If the request is coming through a proxy
  if (req.headers['x-forwarded-host']) {
    const originalUrl = req.originalUrl;

    // Log proxy information
    console.log('Proxied request detected:', {
      originalUrl,
      forwardedHost: req.headers['x-forwarded-host'],
      forwardedProto: req.headers['x-forwarded-proto'],
      forwardedFor: req.headers['x-forwarded-for']
    });
  }
  next();
});

// Comprehensive CORS configuration
app.use((req: Request, res: Response, next: NextFunction) => {
  // Accept requests from both the frontend app and potential API clients
  const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const origin = req.headers.origin;

  // Set CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    // For requests not coming from the known origins (like Postman or curl)
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // Allow all common headers
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

// Health check
app.get('/health', (_req, res) => {
  console.log('Health check endpoint hit');
  res.json({ status: 'ok' });
});

// Debug routes
app.post('/debug/echo', (req, res) => {
  console.log('Echo endpoint hit with body:', req.body);
  res.json({
    received: {
      headers: req.headers,
      body: req.body,
      method: req.method,
      url: req.url
    }
  });
});

// Root endpoint for debugging
app.get('/', (_req, res) => {
  console.log('Root endpoint hit');
  res.json({ message: 'Nooro Task Tracker API is running', endpoints: [
    '/health',
    '/api/tasks',
    '/api/tasks/:id'
  ] });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const status =
    err && typeof err === 'object' && 'status' in err ? (err as any).status : 500;
  const message =
    err instanceof Error ? err.message : 'Internal Server Error';
  
  console.error('ERROR OCCURRED:', {
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    error: err instanceof Error ? 
      { name: err.name, message: err.message, stack: err.stack } : 
      String(err)
  });

  res.status(status).json({ error: message });
});

const PORT = Number(process.env.PORT || 4000);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Try these endpoints:
  - http://localhost:${PORT}/
  - http://localhost:${PORT}/health
  - http://localhost:${PORT}/api/tasks`);
});

export default app;