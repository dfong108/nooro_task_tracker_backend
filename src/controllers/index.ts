import prisma from "../prisma/client";
import { Prisma, Task, TaskColor } from '../../prisma/generated/prisma';
import {handleNotFound, validateColor, validateId, validateTitle} from "../utils";

export type CreateTaskInput = {
  title: string;
  color: TaskColor;
  completed?: boolean;
};

export type UpdateTaskInput = {
  title?: string;
  color?: TaskColor;
  completed?: boolean;
};


/**
 * List all tasks ordered by most recent first
 */
export async function listTasks(): Promise<Task[]> {
  return prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get a single task by id
 */
export async function getTaskById(id: string): Promise<Task | null> {
  validateId(id);
  return prisma.task.findUnique({ where: { id } });
}

/**
 * Create a new task
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  validateTitle(input.title);
  validateColor(input.color);
  
  return prisma.task.create({
    data: {
      title: input.title.trim(),
      color: input.color,
      completed: input.completed ?? false,
    },
  });
}

/**
 * Update a task
 */
export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  validateId(id);
  if (!input || Object.keys(input).length === 0) {
    throw new Error('No fields provided to update.');
  }
  if (typeof input.title !== 'undefined') validateTitle(input.title);
  if (typeof input.color !== 'undefined') validateColor(input.color);
  
  try {
    return await prisma.task.update({
      where: { id },
      data: {
        ...(typeof input.title !== 'undefined' ? { title: input.title.trim() } : {}),
        ...(typeof input.color !== 'undefined' ? { color: input.color } : {}),
        ...(typeof input.completed !== 'undefined' ? { completed: input.completed } : {}),
      },
    });
  } catch (err) {
    handleNotFound(err, id);
    throw err;
  }
}

/**
 * Toggle a task's completion state.
 * If `completed` is not provided, it will flip the current state.
 */
export async function toggleTaskCompletion(id: string, completed?: boolean): Promise<Task> {
  validateId(id);
  
  // If a target state is provided, set directly
  if (typeof completed === 'boolean') {
    return updateTask(id, { completed });
  }
  
  // Otherwise, fetch current and flip
  const existing = await getTaskById(id);
  if (!existing) {
    throw new Error(`Task with id "${id}" not found.`);
  }
  
  return updateTask(id, { completed: !existing.completed });
}

/**
 * Delete a task by id
 */
export async function deleteTask(id: string): Promise<void> {
  validateId(id);
  try {
    await prisma.task.delete({ where: { id } });
  } catch (err) {
    handleNotFound(err, id);
    throw err;
  }
}