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
exports.createBoard = createBoard;
exports.getBoards = getBoards;
exports.getBoard = getBoard;
exports.updateBoard = updateBoard;
exports.deleteBoard = deleteBoard;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// Create a new board
function createBoard(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = request.body;
        const user = request.user;
        if (!name) {
            return reply.status(400).send({ message: 'Board name is required' });
        }
        try {
            const board = yield prisma.board.create({
                data: {
                    name,
                    ownerId: parseInt(user.userId, 10),
                },
            });
            return reply.status(201).send(board);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to create board', error: errorMessage });
        }
    });
}
// Get all boards for the authenticated user
function getBoards(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        try {
            const boards = yield prisma.board.findMany({
                where: { ownerId: parseInt(user.userId, 10) },
                orderBy: { createdAt: 'desc' },
            });
            return reply.send(boards);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to fetch boards', error: errorMessage });
        }
    });
}
// Get a single board by ID (only if owned by user)
function getBoard(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { id } = request.params;
        try {
            const board = yield prisma.board.findFirst({
                where: {
                    id: parseInt(id, 10),
                    ownerId: parseInt(user.userId, 10),
                },
            });
            if (!board) {
                return reply.status(404).send({ message: 'Board not found' });
            }
            return reply.send(board);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to fetch board', error: errorMessage });
        }
    });
}
// Update a board (only if owned by user)
function updateBoard(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { id } = request.params;
        const { name } = request.body;
        try {
            // Check ownership
            const board = yield prisma.board.findFirst({
                where: {
                    id: parseInt(id, 10),
                    ownerId: parseInt(user.userId, 10),
                },
            });
            if (!board) {
                return reply.status(404).send({ message: 'Board not found' });
            }
            const updated = yield prisma.board.update({
                where: { id: parseInt(id, 10) },
                data: { name: name !== null && name !== void 0 ? name : board.name },
            });
            return reply.send(updated);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to update board', error: errorMessage });
        }
    });
}
// Delete a board (only if owned by user)
function deleteBoard(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { id } = request.params;
        try {
            // Check ownership
            const board = yield prisma.board.findFirst({
                where: {
                    id: parseInt(id, 10),
                    ownerId: parseInt(user.userId, 10),
                },
            });
            if (!board) {
                return reply.status(404).send({ message: 'Board not found' });
            }
            yield prisma.board.delete({
                where: { id: parseInt(id, 10) },
            });
            return reply.send({ message: 'Board deleted' });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to delete board', error: errorMessage });
        }
    });
}
