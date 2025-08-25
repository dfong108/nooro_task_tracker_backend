import { Router, Request, Response } from 'express';

// Raw body handling
function getRawBody(req: Request): string {
  if (req.body instanceof Buffer) {
    return req.body.toString('utf8');
  }
  return typeof req.body === 'object' ? JSON.stringify(req.body) : String(req.body || '');
}

import {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  CreateTaskInput,
  UpdateTaskInput,
} from '../controllers';
import { TaskColor } from '../../prisma/generated/prisma';
import { parseBoolean } from '../utils/validators';

const router = Router();

// Debug route for testing task completion
router.post('/debug/complete', (req: Request, res: Response) => {
  console.log('Complete debug endpoint hit with:', {
    body: req.body,
    completedValue: req.body?.completed,
    completedType: typeof req.body?.completed,
    headers: req.headers
  });

  // Parse the completed value in various ways
  const completedValues = {
    asIs: req.body?.completed,
    asBoolean: Boolean(req.body?.completed),
    parsedBool: req.body?.completed === true || req.body?.completed === 'true',
    strictEqual: typeof req.body?.completed === 'boolean' ? req.body.completed : 'not a boolean'
  };

  res.json({
    success: true,
    received: req.body,
    completedValues,
    bodyType: typeof req.body
  });
});

// Debug route for testing raw body parsing
router.post('/debug', (req: Request, res: Response) => {
  const rawBody = getRawBody(req);
  console.log('DEBUG route hit with raw body:', rawBody);

  try {
    // Try to parse the body
    const parsedBody = rawBody ? JSON.parse(rawBody) : {};

    res.json({
      success: true,
      received: {
        headers: req.headers,
        rawBody: rawBody,
        parsedBody: parsedBody,
        bodyFromReq: req.body
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: `Failed to parse body: ${(err as Error).message}`,
      rawBody: rawBody
    });
  }
});

function statusFromError(err: unknown): number {
  const msg = err instanceof Error ? err.message.toLowerCase() : '';
  if (msg.includes('not found')) return 404;
  if (
    msg.includes('required') ||
    msg.includes('invalid') ||
    msg.includes('must') ||
    msg.includes('no fields')
  ) {
    return 400;
  }
  return 500;
}

router.get('/tasks', async (_req: Request, res: Response) => {
  try {
    const tasks = await listTasks();
    res.json({ data: tasks });
  } catch (err) {
    res.status(statusFromError(err)).json({ error: (err as Error).message });
  }
});

router.get('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (err) {
    res.status(statusFromError(err)).json({ error: (err as Error).message });
  }
});

router.post('/tasks', async (req: Request, res: Response) => {
  try {
    // Get the raw body for debug
    const rawBody = getRawBody(req);

    // Debug the incoming request in detail
    console.log('POST /tasks - Full Request:', {
      rawBody,
      headers: req.headers,
      body: req.body,
    });
    
    if (req.body === undefined || req.body === null) {
      console.error('Request body is undefined or null');
      
      if (rawBody) {
        try {
          req.body = JSON.parse(rawBody);
          console.log('Manually parsed JSON body:', req.body);
        } catch (err) {
          console.error('Failed to parse raw body:', err);
          return res.status(400).json({ error: 'Invalid JSON in request body' });
        }
      } else {
        return res.status(400).json({ error: 'Missing request body' });
      }
    }

    // If body is not an object
    if (typeof req.body !== 'object') {
      console.error('Request body is not an object:', typeof req.body);
      return res.status(400).json({ error: 'Invalid request body format' });
    }

    // Create a safe copy of the input
    const input = { ...req.body } as CreateTaskInput;
    console.log('Parsed task input:', input);

    // Validate required fields before proceeding
    if (!input.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!input.color) {
      return res.status(400).json({ error: 'Color is required' });
    }

    try {
      // Normalize color to uppercase
      input.color = String(input.color).trim().toUpperCase() as TaskColor;
    } catch (err) {
      console.error('Color normalization error:', err);
      return res.status(400).json({ error: 'Invalid color format' });
    }

    const task = await createTask(input);
    res.status(201).json({ data: task });
  } catch (err) {
    res.status(statusFromError(err)).json({ error: (err as Error).message });
  }
});

router.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const input = req.body as UpdateTaskInput;
    console.log('Received update task input:', input);

    // Normalize color to uppercase if it exists
    if (input.color) {
      input.color = input.color.toString().trim().toUpperCase() as TaskColor;
    }

    // Make sure we have at least one field to update
    if (Object.keys(input).length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    const task = await updateTask(req.params.id, input);

    // Return 200 status with the updated task data
    res.status(200).json({ data: task });
  } catch (err) {
    res.status(statusFromError(err)).json({ error: (err as Error).message });
  }
});

router.patch('/tasks/:id/complete', async (req: Request, res: Response) => {
  try {
    console.log('PATCH task completion - Request details:', {
      taskId: req.params.id,
      body: req.body,
      bodyType: typeof req.body,
      completedValue: req.body?.completed,
      completedType: typeof req.body?.completed
    });

    // Get the completed value using our utility function
    const completed = parseBoolean(req.body?.completed);

    console.log('Task completion details:', {
      originalValue: req.body?.completed,
      originalType: typeof req.body?.completed,
      parsedValue: completed,
      parsedType: typeof completed,
      bodyContent: req.body
    });

    const task = await toggleTaskCompletion(req.params.id, completed);
    res.status(200).json({ data: task });
  } catch (err) {
    res.status(statusFromError(err)).json({ error: (err as Error).message });
  }
});

router.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    await deleteTask(req.params.id);
    res.status(200).json({ data: { message: 'Task deleted successfully' } });
  } catch (err) {
    res.status(statusFromError(err)).json({ error: (err as Error).message });
  }
});

export default router;