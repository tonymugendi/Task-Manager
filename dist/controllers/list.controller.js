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
exports.createList = createList;
exports.getLists = getLists;
exports.getList = getList;
exports.updateList = updateList;
exports.deleteList = deleteList;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// Create a new list within a board
function createList(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId } = request.params;
        const { name, position } = request.body;
        if (!name || typeof position !== 'number') {
            return reply.status(400).send({ message: 'List name and position are required' });
        }
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
        try {
            const list = yield prisma.list.create({
                data: {
                    name,
                    position,
                    boardId: board.id,
                },
            });
            return reply.status(201).send(list);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to create list', error: errorMessage });
        }
    });
}
// Get all lists for a board (owned by user)
function getLists(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId } = request.params;
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
        try {
            const lists = yield prisma.list.findMany({
                where: { boardId: board.id },
                orderBy: { position: 'asc' },
            });
            return reply.send(lists);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to fetch lists', error: errorMessage });
        }
    });
}
// Get a single list by ID (within a board)
function getList(request, reply) {
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
        try {
            const list = yield prisma.list.findFirst({
                where: {
                    id: parseInt(listId, 10),
                    boardId: board.id,
                },
            });
            if (!list) {
                return reply.status(404).send({ message: 'List not found' });
            }
            return reply.send(list);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to fetch list', error: errorMessage });
        }
    });
}
// Update a list (within a board)
function updateList(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const { boardId, listId } = request.params;
        const { name, position } = request.body;
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
        // Ensure the list exists and belongs to the board
        const list = yield prisma.list.findFirst({
            where: {
                id: parseInt(listId, 10),
                boardId: board.id,
            },
        });
        if (!list) {
            return reply.status(404).send({ message: 'List not found' });
        }
        try {
            const updated = yield prisma.list.update({
                where: { id: list.id },
                data: {
                    name: name !== null && name !== void 0 ? name : list.name,
                    position: typeof position === 'number' ? position : list.position,
                },
            });
            return reply.send(updated);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to update list', error: errorMessage });
        }
    });
}
// Delete a list (within a board)
function deleteList(request, reply) {
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
        // Ensure the list exists and belongs to the board
        const list = yield prisma.list.findFirst({
            where: {
                id: parseInt(listId, 10),
                boardId: board.id,
            },
        });
        if (!list) {
            return reply.status(404).send({ message: 'List not found' });
        }
        try {
            yield prisma.list.delete({
                where: { id: list.id },
            });
            return reply.send({ message: 'List deleted' });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return reply.status(500).send({ message: 'Failed to delete list', error: errorMessage });
        }
    });
}
