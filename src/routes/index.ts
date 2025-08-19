import { Router, Request, Response } from 'express';
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

const router = Router();

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
    const input = req.body as CreateTaskInput;
    const task = await createTask(input);
    res.status(201).json({ data: task });
  } catch (err) {
    res.status(statusFromError(err)).json({ error: (err as Error).message });
  }
});

router.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const input = req.body as UpdateTaskInput;
    const task = await updateTask(req.params.id, input);
    res.json({ data: task });
  } catch (err) {
    res.status(statusFromError(err)).json({ error: (err as Error).message });
  }
});

router.patch('/tasks/:id/complete', async (req: Request, res: Response) => {
  try {
    const completed =
      typeof req.body?.completed === 'boolean' ? (req.body.completed as boolean) : undefined;
    const task = await toggleTaskCompletion(req.params.id, completed);
    res.json({ data: task });
  } catch (err) {
    res.status(statusFromError(err)).json({ error: (err as Error).message });
  }
});

router.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    await deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(statusFromError(err)).json({ error: (err as Error).message });
  }
});

export default router;