import { PrismaClient } from '../generated/prisma';
import { FastifyRequest, FastifyReply } from 'fastify';

const prisma = new PrismaClient();

// Create a new board
export async function createBoard(request: FastifyRequest, reply: FastifyReply) {
  const { name } = request.body as { name: string };
  const user = (request as any).user;

  if (!name) {
    return reply.status(400).send({ message: 'Board name is required' });
  }

  try {
    const board = await prisma.board.create({
      data: {
        name,
        ownerId: parseInt(user.userId, 10),
      },
    });
    return reply.status(201).send(board);
  } catch (error) {
    return reply.status(500).send({ message: 'Failed to create board', error: error.message });
  }
}

// Get all boards for the authenticated user
export async function getBoards(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;

  try {
    const boards = await prisma.board.findMany({
      where: { ownerId: parseInt(user.userId, 10) },
      orderBy: { createdAt: 'desc' },
    });
    return reply.send(boards);
  } catch (error) {
    return reply.status(500).send({ message: 'Failed to fetch boards', error: error.message });
  }
}

// Get a single board by ID (only if owned by user)
export async function getBoard(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { id } = request.params as { id: string };

  try {
    const board = await prisma.board.findFirst({
      where: {
        id: parseInt(id, 10),
        ownerId: parseInt(user.userId, 10),
      },
    });
    if (!board) {
      return reply.status(404).send({ message: 'Board not found' });
    }
    return reply.send(board);
  } catch (error) {
    return reply.status(500).send({ message: 'Failed to fetch board', error: error.message });
  }
}

// Update a board (only if owned by user)
export async function updateBoard(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { id } = request.params as { id: string };
  const { name } = request.body as { name?: string };

  try {
    // Check ownership
    const board = await prisma.board.findFirst({
      where: {
        id: parseInt(id, 10),
        ownerId: parseInt(user.userId, 10),
      },
    });
    if (!board) {
      return reply.status(404).send({ message: 'Board not found' });
    }

    const updated = await prisma.board.update({
      where: { id: parseInt(id, 10) },
      data: { name: name ?? board.name },
    });
    return reply.send(updated);
  } catch (error) {
    return reply.status(500).send({ message: 'Failed to update board', error: error.message });
  }
}

// Delete a board (only if owned by user)
export async function deleteBoard(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { id } = request.params as { id: string };

  try {
    // Check ownership
    const board = await prisma.board.findFirst({
      where: {
        id: parseInt(id, 10),
        ownerId: parseInt(user.userId, 10),
      },
    });
    if (!board) {
      return reply.status(404).send({ message: 'Board not found' });
    }

    await prisma.board.delete({
      where: { id: parseInt(id, 10) },
    });
    return reply.send({ message: 'Board deleted' });
  } catch (error) {
    return reply.status(500).send({ message: 'Failed to delete board', error: error.message });
  }
}