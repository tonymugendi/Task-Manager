"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
exports.getTasks = getTasks;
exports.getTask = getTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
const prisma_1 = require("../generated/prisma");
const task_schema_1 = require("../schemas/task.schema");
const prisma = new prisma_1.PrismaClient();
// Create a new task within a list
function createTask(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId } = request.params;
        const validateTask = task_schema_1.createTaskSchema.safeParse(request.body);
        if (!validateTask.success) {
            return reply.status(400).send({ message: validateTask.error.message });
        }
        const { title, description, status, dueDate, position } = validateTask.data;
        // Ensure the user owns the board
        const board = yield prisma.board.findFirst({
            where: {
                id: parseInt(boardId, 10),
                ownerId: parseInt(user.userId, 10),
            },
        });
        if (!board) {
            return reply.status(404).send({ message: 'Board not found or access denied' });
        }
        // Ensure the list belongs to the board
        const list = yield prisma.list.findFirst({
            where: {
                id: parseInt(listId, 10),
                boardId: board.id,
            },
        });
        if (!list) {
            return reply.status(404).send({ message: 'List not found or access denied' });
        }
        try {
            const task = yield prisma.task.create({
                data: {
                    title,
                    description,
                    status,
                    dueDate: dueDate ? new Date(dueDate) : undefined,
                    position,
                    listId: list.id,
                },
            });
            return reply.status(201).send(task);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to create task', error: errorMessage });
        }
    });
}
// Get all tasks for a list (owned by user)
function getTasks(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId } = request.params;
        // Ensure the user owns the board
        const board = yield prisma.board.findFirst({
            where: {
                id: parseInt(boardId, 10),
                ownerId: parseInt(user.userId, 10),
            },
        });
        if (!board) {
            return reply.status(404).send({ message: 'Board not found or access denied' });
        }
        // Ensure the list belongs to the board
        const list = yield prisma.list.findFirst({
            where: {
                id: parseInt(listId, 10),
                boardId: board.id,
            },
        });
        if (!list) {
            return reply.status(404).send({ message: 'List not found or access denied' });
        }
        try {
            const tasks = yield prisma.task.findMany({
                where: { listId: list.id },
                orderBy: { position: 'asc' },
            });
            return reply.send(tasks);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to fetch tasks', error: errorMessage });
        }
    });
}
// Get a single task by ID (within a list)
function getTask(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId, taskId } = request.params;
        // Ensure the user owns the board
        const board = yield prisma.board.findFirst({
            where: {
                id: parseInt(boardId, 10),
                ownerId: parseInt(user.userId, 10),
            },
        });
        if (!board) {
            return reply.status(404).send({ message: 'Board not found or access denied' });
        }
        // Ensure the list belongs to the board
        const list = yield prisma.list.findFirst({
            where: {
                id: parseInt(listId, 10),
                boardId: board.id,
            },
        });
        if (!list) {
            return reply.status(404).send({ message: 'List not found or access denied' });
        }
        try {
            const task = yield prisma.task.findFirst({
                where: {
                    id: parseInt(taskId, 10),
                    listId: list.id,
                },
            });
            if (!task) {
                return reply.status(404).send({ message: 'Task not found' });
            }
            return reply.send(task);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to fetch task', error: errorMessage });
        }
    });
}
// Update a task (within a list)
function updateTask(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId, taskId } = request.params;
        const { title, description, status, dueDate, position } = request.body;
        // Ensure the user owns the board
        const board = yield prisma.board.findFirst({
            where: {
                id: parseInt(boardId, 10),
                ownerId: parseInt(user.userId, 10),
            },
        });
        if (!board) {
            return reply.status(404).send({ message: 'Board not found or access denied' });
        }
        // Ensure the list belongs to the board
        const list = yield prisma.list.findFirst({
            where: {
                id: parseInt(listId, 10),
                boardId: board.id,
            },
        });
        if (!list) {
            return reply.status(404).send({ message: 'List not found or access denied' });
        }
        // Ensure the task exists and belongs to the list
        const task = yield prisma.task.findFirst({
            where: {
                id: parseInt(taskId, 10),
                listId: list.id,
            },
        });
        if (!task) {
            return reply.status(404).send({ message: 'Task not found' });
        }
        try {
            const updated = yield prisma.task.update({
                where: { id: task.id },
                data: {
                    title: title !== null && title !== void 0 ? title : task.title,
                    description: description !== null && description !== void 0 ? description : task.description,
                    status: status !== null && status !== void 0 ? status : task.status,
                    dueDate: dueDate ? new Date(dueDate) : task.dueDate,
                    position: typeof position === 'number' ? position : task.position,
                },
            });
            return reply.send(updated);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to update task', error: errorMessage });
        }
    });
}
// Delete a task (within a list)
function deleteTask(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId, taskId } = request.params;
        // Ensure the user owns the board
        const board = yield prisma.board.findFirst({
            where: {
                id: parseInt(boardId, 10),
                ownerId: parseInt(user.userId, 10),
            },
        });
        if (!board) {
            return reply.status(404).send({ message: 'Board not found or access denied' });
        }
        // Ensure the list belongs to the board
        const list = yield prisma.list.findFirst({
            where: {
                id: parseInt(listId, 10),
                boardId: board.id,
            },
        });
        if (!list) {
            return reply.status(404).send({ message: 'List not found or access denied' });
        }
        // Ensure the task exists and belongs to the list
        const task = yield prisma.task.findFirst({
            where: {
                id: parseInt(taskId, 10),
                listId: list.id,
            },
        });
        if (!task) {
            return reply.status(404).send({ message: 'Task not found' });
        }
        try {
            yield prisma.task.delete({
                where: { id: task.id },
            });
            return reply.send({ message: 'Task deleted' });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to delete task', error: errorMessage });
        }
    });
}
