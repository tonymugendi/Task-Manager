"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.taskIdParamSchema = exports.listIdParamSchema = exports.boardIdParamSchema = exports.idParamSchema = exports.updateCommentSchema = exports.createCommentSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.updateListSchema = exports.createListSchema = exports.updateBoardSchema = exports.createBoardSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// Auth validation schemas
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").max(100, "Name too long").optional(),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password too long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number")
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required")
});
// Board validation schemas
exports.createBoardSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, "Board name is required")
        .max(100, "Board name too long")
        .trim(),
    description: zod_1.z.string().max(500, "Description too long").optional()
});
exports.updateBoardSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, "Board name is required")
        .max(100, "Board name too long")
        .trim()
        .optional(),
    description: zod_1.z.string().max(500, "Description too long").optional()
});
// List validation schemas
exports.createListSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, "List name is required")
        .max(100, "List name too long")
        .trim(),
    position: zod_1.z.number().int().min(0, "Position must be non-negative")
});
exports.updateListSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, "List name is required")
        .max(100, "List name too long")
        .trim()
        .optional(),
    position: zod_1.z.number().int().min(0, "Position must be non-negative").optional()
});
// Task validation schemas
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(1, "Task title is required")
        .max(200, "Task title too long")
        .trim(),
    description: zod_1.z.string().max(1000, "Description too long").optional(),
    dueDate: zod_1.z.string().datetime("Invalid date format").optional(),
    position: zod_1.z.number().int().min(0, "Position must be non-negative"),
    assigneeId: zod_1.z.number().int().positive("Invalid assignee ID").optional()
});
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(1, "Task title is required")
        .max(200, "Task title too long")
        .trim()
        .optional(),
    description: zod_1.z.string().max(1000, "Description too long").optional(),
    dueDate: zod_1.z.string().datetime("Invalid date format").optional(),
    position: zod_1.z.number().int().min(0, "Position must be non-negative").optional(),
    assigneeId: zod_1.z.number().int().positive("Invalid assignee ID").optional()
});
// Comment validation schemas
exports.createCommentSchema = zod_1.z.object({
    content: zod_1.z.string()
        .min(1, "Comment content is required")
        .max(500, "Comment too long")
        .trim()
});
exports.updateCommentSchema = zod_1.z.object({
    content: zod_1.z.string()
        .min(1, "Comment content is required")
        .max(500, "Comment too long")
        .trim()
});
// Parameter validation schemas
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, "Invalid ID format").transform(Number)
});
exports.boardIdParamSchema = zod_1.z.object({
    boardId: zod_1.z.string().regex(/^\d+$/, "Invalid board ID format").transform(Number)
});
exports.listIdParamSchema = zod_1.z.object({
    listId: zod_1.z.string().regex(/^\d+$/, "Invalid list ID format").transform(Number)
});
exports.taskIdParamSchema = zod_1.z.object({
    taskId: zod_1.z.string().regex(/^\d+$/, "Invalid task ID format").transform(Number)
});
// Query parameter schemas
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).pipe(zod_1.z.number().min(1)).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).pipe(zod_1.z.number().min(1).max(100)).optional()
});
