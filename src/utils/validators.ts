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
  if (!color) {
    throw new Error('Color is required.');
  }

  // Convert to string if it's not already
  const colorStr = String(color).trim().toUpperCase();
  const allowed = new Set(Object.values(TaskColor));

  if (!allowed.has(colorStr as TaskColor)) {
    throw new Error(`Color '${color}' is not valid. Must be one of: ${Array.from(allowed).join(', ')}`);
  }

  return colorStr as TaskColor;
}

export function handleNotFound(err: unknown, id: string) {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2025'
  ) {
    throw new Error(`Task with id "${id}" not found.`);
  }
}

/**
 * Helper to convert various boolean-like values to actual booleans
 */
export function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'true' || value === '1' || value === 1) {
    return true;
  }
  if (value === 'false' || value === '0' || value === 0) {
    return false;
  }
  return undefined; // Unable to determine
}
