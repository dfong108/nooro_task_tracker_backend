/* Helpers */

import { Prisma, Task, TaskColor } from '../../prisma/generated/prisma';

export function validateId(id: string) {
  if (!id) {
    throw new Error('A valid task id must be provided.');
  }
  // Optional: enforce typical cuid length (25). Adjust if necessary.
  if (id.length > 100) {
    throw new Error('Task id appears invalid.');
  }
}

export function validateTitle(title: string) {
  if (title.trim().length === 0) {
    throw new Error('Title is required.');
  }
  if (title.trim().length > 255) {
    throw new Error('Title must be at most 255 characters.');
  }
}

export function validateColor(color: unknown) {
  const allowed = new Set(Object.values(TaskColor));
  if (!allowed.has(color as TaskColor)) {
    throw new Error(`Color must be one of: ${Array.from(allowed).join(', ')}`);
  }
}

export function handleNotFound(err: unknown, id: string) {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2025'
  ) {
    throw new Error(`Task with id "${id}" not found.`);
  }
}
