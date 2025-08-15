import { z } from 'zod';

// Auth validation schemas
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number")
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

// Board validation schemas
export const createBoardSchema = z.object({
  name: z.string()
    .min(1, "Board name is required")
    .max(100, "Board name too long")
    .trim(),
  description: z.string().max(500, "Description too long").optional()
});

export const updateBoardSchema = z.object({
  name: z.string()
    .min(1, "Board name is required")
    .max(100, "Board name too long")
    .trim()
    .optional(),
  description: z.string().max(500, "Description too long").optional()
});

// List validation schemas
export const createListSchema = z.object({
  name: z.string()
    .min(1, "List name is required")
    .max(100, "List name too long")
    .trim(),
  position: z.number().int().min(0, "Position must be non-negative")
});

export const updateListSchema = z.object({
  name: z.string()
    .min(1, "List name is required")
    .max(100, "List name too long")
    .trim()
    .optional(),
  position: z.number().int().min(0, "Position must be non-negative").optional()
});

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string()
    .min(1, "Task title is required")
    .max(200, "Task title too long")
    .trim(),
  description: z.string().max(1000, "Description too long").optional(),
  dueDate: z.string().datetime("Invalid date format").optional(),
  position: z.number().int().min(0, "Position must be non-negative"),
  assigneeId: z.number().int().positive("Invalid assignee ID").optional()
});

export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, "Task title is required")
    .max(200, "Task title too long")
    .trim()
    .optional(),
  description: z.string().max(1000, "Description too long").optional(),
  dueDate: z.string().datetime("Invalid date format").optional(),
  position: z.number().int().min(0, "Position must be non-negative").optional(),
  assigneeId: z.number().int().positive("Invalid assignee ID").optional()
});

// Comment validation schemas
export const createCommentSchema = z.object({
  content: z.string()
    .min(1, "Comment content is required")
    .max(500, "Comment too long")
    .trim()
});

export const updateCommentSchema = z.object({
  content: z.string()
    .min(1, "Comment content is required")
    .max(500, "Comment too long")
    .trim()
});

// Parameter validation schemas
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid ID format").transform(Number)
});

export const boardIdParamSchema = z.object({
  boardId: z.string().regex(/^\d+$/, "Invalid board ID format").transform(Number)
});

export const listIdParamSchema = z.object({
  listId: z.string().regex(/^\d+$/, "Invalid list ID format").transform(Number)
});

export const taskIdParamSchema = z.object({
  taskId: z.string().regex(/^\d+$/, "Invalid task ID format").transform(Number)
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1).max(100)).optional()
});
