import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { signJwt } from '../../src/utils/jwt';

// Test database instance
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Clean up database before/after tests
export const cleanDatabase = async () => {
  const tablenames = await testPrisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
};

// Create test user helper
export const createTestUser = async (userData?: {
  name?: string;
  email?: string;
  password?: string;
}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: '$2b$10$rQj9pGx7Zt5Z9Yt5Z9Yt5O9Yt5Z9Yt5Z9Yt5Z9Yt5Z9Yt5Z9Yt5Z', // hashed "password123"
  };

  const user = await testPrisma.user.create({
    data: { ...defaultUser, ...userData }
  });

  return user;
};

// Create test board helper
export const createTestBoard = async (ownerId: number, boardData?: {
  name?: string;
  description?: string;
}) => {
  const defaultBoard = {
    name: 'Test Board',
    description: 'A test board',
  };

  const board = await testPrisma.board.create({
    data: {
      ...defaultBoard,
      ...boardData,
      ownerId,
    }
  });

  return board;
};

// Create test list helper
export const createTestList = async (boardId: number, listData?: {
  name?: string;
  position?: number;
}) => {
  const defaultList = {
    name: 'Test List',
    position: 0,
  };

  const list = await testPrisma.list.create({
    data: {
      ...defaultList,
      ...listData,
      boardId,
    }
  });

  return list;
};

// Create test task helper
export const createTestTask = async (listId: number, taskData?: {
  title?: string;
  description?: string;
  position?: number;
  assigneeId?: number;
}) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'A test task',
    position: 0,
  };

  const task = await testPrisma.task.create({
    data: {
      ...defaultTask,
      ...taskData,
      listId,
    }
  });

  return task;
};

// Generate test JWT token
export const generateTestToken = (userId: number): string => {
  return signJwt({ userId });
};

// Create authorization header
export const createAuthHeader = (userId: number): { Authorization: string } => {
  const token = generateTestToken(userId);
  return { Authorization: `Bearer ${token}` };
};

// Test data factories
export const testDataFactory = {
  user: (overrides?: any) => ({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
    ...overrides
  }),

  board: (overrides?: any) => ({
    name: 'My Board',
    description: 'A sample board',
    ...overrides
  }),

  list: (overrides?: any) => ({
    name: 'To Do',
    position: 0,
    ...overrides
  }),

  task: (overrides?: any) => ({
    title: 'Sample Task',
    description: 'A sample task description',
    position: 0,
    ...overrides
  }),

  comment: (overrides?: any) => ({
    content: 'This is a test comment',
    ...overrides
  })
};
