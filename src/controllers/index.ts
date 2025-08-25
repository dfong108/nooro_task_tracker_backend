import { prisma } from "../prisma/client";
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
  const normalizedColor = validateColor(input.color);

  console.log("Create Task", input)
  return prisma.task.create({
    data: {
      title: input.title.trim(),
      color: normalizedColor,
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
    // Prepare normalized data for update
    const updateData: any = {};

    if (typeof input.title !== 'undefined') {
      updateData.title = input.title.trim();
    }

    if (typeof input.color !== 'undefined') {
      updateData.color = validateColor(input.color);
    }

    if (typeof input.completed !== 'undefined') {
      console.log(`Setting completed status to: ${input.completed} (${typeof input.completed})`);
      updateData.completed = input.completed;
    } else {
      console.log('No completed status provided in update');
    }

    console.log("Update Task data:", {
      id,
      inputReceived: input,
      processedData: updateData,
      hasCompletedField: 'completed' in input,
      completedValueType: typeof input.completed
    });

    return await prisma.task.update({
      where: { id },
      data: updateData,
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
  console.log(`toggleTaskCompletion for task ${id} with completed=${completed} (${typeof completed})`);
  validateId(id);

  // Get the existing task first
  const existing = await getTaskById(id);
  if (!existing) {
    throw new Error(`Task with id "${id}" not found.`);
  }

  console.log('Current task state:', {
    id: existing.id,
    title: existing.title,
    currentCompleted: existing.completed
  });

  // If a target state is provided, use it directly
  if (typeof completed === 'boolean') {
    console.log(`Setting task completion to explicit value: ${completed}`);
    // Use direct Prisma update for clarity and to bypass any potential issues in updateTask
    return prisma.task.update({
      where: { id },
      data: { completed }
    });
  }

  // Otherwise, flip the current state
  const newCompletedState = !existing.completed;
  console.log(`Flipping task completion from ${existing.completed} to ${newCompletedState}`);
  // Use direct Prisma update
  return prisma.task.update({
    where: { id },
    data: { completed: newCompletedState }
  });
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