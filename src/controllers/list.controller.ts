import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';

const prisma = new PrismaClient();

// Create a new list within a board
export async function createList(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId } = request.params as { boardId: string };
  const { name, position } = request.body as { name: string; position: number };

  if (!name || typeof position !== 'number') {
    return reply.status(400).send({ message: 'List name and position are required' });
  }

  // Ensure the user owns the board
  const board = await prisma.board.findFirst({
    where: {
      id: parseInt(boardId, 10),
      ownerId: parseInt(user.userId, 10),
    },
  });

  if (!board) {
    return reply.status(404).send({ message: 'Board not found or access denied' });
  }

  try {
    const list = await prisma.list.create({
      data: {
        name,
        position,
        boardId: board.id,
      },
    });
    return reply.status(201).send(list);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to create list', error: errorMessage });
  }
}

// Get all lists for a board (owned by user)
export async function getLists(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId } = request.params as { boardId: string };

  // Ensure the user owns the board
  const board = await prisma.board.findFirst({
    where: {
      id: parseInt(boardId, 10),
      ownerId: parseInt(user.userId, 10),
    },
  });

  if (!board) {
    return reply.status(404).send({ message: 'Board not found or access denied' });
  }

  try {
    const lists = await prisma.list.findMany({
      where: { boardId: board.id },
      orderBy: { position: 'asc' },
    });
    return reply.send(lists);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to fetch lists', error: errorMessage });
  }
}

// Get a single list by ID (within a board)
export async function getList(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId } = request.params as { boardId: string; listId: string };

  // Ensure the user owns the board
  const board = await prisma.board.findFirst({
    where: {
      id: parseInt(boardId, 10),
      ownerId: parseInt(user.userId, 10),
    },
  });

  if (!board) {
    return reply.status(404).send({ message: 'Board not found or access denied' });
  }

  try {
    const list = await prisma.list.findFirst({
      where: {
        id: parseInt(listId, 10),
        boardId: board.id,
      },
    });
    if (!list) {
      return reply.status(404).send({ message: 'List not found' });
    }
    return reply.send(list);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to fetch list', error: errorMessage });
  }
}

// Update a list (within a board)
export async function updateList(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId } = request.params as { boardId: string; listId: string };
  const { name, position } = request.body as { name?: string; position?: number };

  // Ensure the user owns the board
  const board = await prisma.board.findFirst({
    where: {
      id: parseInt(boardId, 10),
      ownerId: parseInt(user.userId, 10),
    },
  });

  if (!board) {
    return reply.status(404).send({ message: 'Board not found or access denied' });
  }

  // Ensure the list exists and belongs to the board
  const list = await prisma.list.findFirst({
    where: {
      id: parseInt(listId, 10),
      boardId: board.id,
    },
  });

  if (!list) {
    return reply.status(404).send({ message: 'List not found' });
  }

  try {
    const updated = await prisma.list.update({
      where: { id: list.id },
      data: {
        name: name ?? list.name,
        position: typeof position === 'number' ? position : list.position,
      },
    });
    return reply.send(updated);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to update list', error: errorMessage });
  }
}

// Delete a list (within a board)
export async function deleteList(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId } = request.params as { boardId: string; listId: string };

  // Ensure the user owns the board
  const board = await prisma.board.findFirst({
    where: {
      id: parseInt(boardId, 10),
      ownerId: parseInt(user.userId, 10),
    },
  });

  if (!board) {
    return reply.status(404).send({ message: 'Board not found or access denied' });
  }

  // Ensure the list exists and belongs to the board
  const list = await prisma.list.findFirst({
    where: {
      id: parseInt(listId, 10),
      boardId: board.id,
    },
  });

  if (!list) {
    return reply.status(404).send({ message: 'List not found' });
  }

  try {
    await prisma.list.delete({
      where: { id: list.id },
    });
    return reply.send({ message: 'List deleted' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to delete list', error: errorMessage });
  }
}