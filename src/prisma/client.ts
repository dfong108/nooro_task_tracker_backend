import { PrismaClient } from '../../prisma/generated/prisma';

// Create a singleton Prisma Client instance
export const prisma = new PrismaClient();
export default prisma; // Also provide a default export for compatibility