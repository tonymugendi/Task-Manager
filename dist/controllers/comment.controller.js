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
exports.createComment = createComment;
exports.getComments = getComments;
exports.getComment = getComment;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// Create a new comment on a task
function createComment(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId, taskId } = request.params;
        const { content } = request.body;
        if (!content) {
            return reply.status(400).send({ message: 'Comment content is required' });
        }
        // Ownership and existence checks
        const board = yield prisma.board.findFirst({
            where: { id: parseInt(boardId, 10), ownerId: parseInt(user.userId, 10) },
        });
        if (!board)
            return reply.status(404).send({ message: 'Board not found or access denied' });
        const list = yield prisma.list.findFirst({
            where: { id: parseInt(listId, 10), boardId: board.id },
        });
        if (!list)
            return reply.status(404).send({ message: 'List not found or access denied' });
        const task = yield prisma.task.findFirst({
            where: { id: parseInt(taskId, 10), listId: list.id },
        });
        if (!task)
            return reply.status(404).send({ message: 'Task not found or access denied' });
        try {
            const comment = yield prisma.comment.create({
                data: {
                    content,
                    taskId: task.id,
                    authorId: parseInt(user.userId, 10),
                },
            });
            return reply.status(201).send(comment);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to create comment', error: errorMessage });
        }
    });
}
// Get all comments for a task
function getComments(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId, taskId } = request.params;
        // Ownership and existence checks
        const board = yield prisma.board.findFirst({
            where: { id: parseInt(boardId, 10), ownerId: parseInt(user.userId, 10) },
        });
        if (!board)
            return reply.status(404).send({ message: 'Board not found or access denied' });
        const list = yield prisma.list.findFirst({
            where: { id: parseInt(listId, 10), boardId: board.id },
        });
        if (!list)
            return reply.status(404).send({ message: 'List not found or access denied' });
        const task = yield prisma.task.findFirst({
            where: { id: parseInt(taskId, 10), listId: list.id },
        });
        if (!task)
            return reply.status(404).send({ message: 'Task not found or access denied' });
        try {
            const comments = yield prisma.comment.findMany({
                where: { taskId: task.id },
                orderBy: { createdAt: 'asc' },
            });
            return reply.send(comments);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to fetch comments', error: errorMessage });
        }
    });
}
// Get a single comment by ID
function getComment(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId, taskId, commentId } = request.params;
        // Ownership and existence checks
        const board = yield prisma.board.findFirst({
            where: { id: parseInt(boardId, 10), ownerId: parseInt(user.userId, 10) },
        });
        if (!board)
            return reply.status(404).send({ message: 'Board not found or access denied' });
        const list = yield prisma.list.findFirst({
            where: { id: parseInt(listId, 10), boardId: board.id },
        });
        if (!list)
            return reply.status(404).send({ message: 'List not found or access denied' });
        const task = yield prisma.task.findFirst({
            where: { id: parseInt(taskId, 10), listId: list.id },
        });
        if (!task)
            return reply.status(404).send({ message: 'Task not found or access denied' });
        try {
            const comment = yield prisma.comment.findFirst({
                where: {
                    id: parseInt(commentId, 10),
                    taskId: task.id,
                },
            });
            if (!comment)
                return reply.status(404).send({ message: 'Comment not found' });
            return reply.send(comment);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to fetch comment', error: errorMessage });
        }
    });
}
// Update a comment (only by author)
function updateComment(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId, taskId, commentId } = request.params;
        const { content } = request.body;
        // Ownership and existence checks
        const board = yield prisma.board.findFirst({
            where: { id: parseInt(boardId, 10), ownerId: parseInt(user.userId, 10) },
        });
        if (!board)
            return reply.status(404).send({ message: 'Board not found or access denied' });
        const list = yield prisma.list.findFirst({
            where: { id: parseInt(listId, 10), boardId: board.id },
        });
        if (!list)
            return reply.status(404).send({ message: 'List not found or access denied' });
        const task = yield prisma.task.findFirst({
            where: { id: parseInt(taskId, 10), listId: list.id },
        });
        if (!task)
            return reply.status(404).send({ message: 'Task not found or access denied' });
        const comment = yield prisma.comment.findFirst({
            where: {
                id: parseInt(commentId, 10),
                taskId: task.id,
                authorId: parseInt(user.userId, 10),
            },
        });
        if (!comment)
            return reply.status(404).send({ message: 'Comment not found or not owned by user' });
        try {
            const updated = yield prisma.comment.update({
                where: { id: comment.id },
                data: { content },
            });
            return reply.send(updated);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to update comment', error: errorMessage });
        }
    });
}
// Delete a comment (only by author)
function deleteComment(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId, taskId, commentId } = request.params;
        // Ownership and existence checks
        const board = yield prisma.board.findFirst({
            where: { id: parseInt(boardId, 10), ownerId: parseInt(user.userId, 10) },
        });
        if (!board)
            return reply.status(404).send({ message: 'Board not found or access denied' });
        const list = yield prisma.list.findFirst({
            where: { id: parseInt(listId, 10), boardId: board.id },
        });
        if (!list)
            return reply.status(404).send({ message: 'List not found or access denied' });
        const task = yield prisma.task.findFirst({
            where: { id: parseInt(taskId, 10), listId: list.id },
        });
        if (!task)
            return reply.status(404).send({ message: 'Task not found or access denied' });
        const comment = yield prisma.comment.findFirst({
            where: {
                id: parseInt(commentId, 10),
                taskId: task.id,
                authorId: parseInt(user.userId, 10),
            },
        });
        if (!comment)
            return reply.status(404).send({ message: 'Comment not found or not owned by user' });
        try {
            yield prisma.comment.delete({
                where: { id: comment.id },
            });
            return reply.send({ message: 'Comment deleted' });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to delete comment', error: errorMessage });
        }
    });
}
