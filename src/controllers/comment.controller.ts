import { PrismaClient } from '../generated/prisma';
import { FastifyRequest, FastifyReply } from 'fastify';

const prisma = new PrismaClient();

// Create a new comment on a task
export async function createComment(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId, taskId } = request.params as { boardId: string; listId: string; taskId: string };
  const { content } = request.body as { content: string };

  if (!content) {
    return reply.status(400).send({ message: 'Comment content is required' });
  }

  // Ownership and existence checks
  const board = await prisma.board.findFirst({
    where: { id: parseInt(boardId, 10), ownerId: parseInt(user.userId, 10) },
  });
  if (!board) return reply.status(404).send({ message: 'Board not found or access denied' });

  const list = await prisma.list.findFirst({
    where: { id: parseInt(listId, 10), boardId: board.id },
  });
  if (!list) return reply.status(404).send({ message: 'List not found or access denied' });

  const task = await prisma.task.findFirst({
    where: { id: parseInt(taskId, 10), listId: list.id },
  });
  if (!task) return reply.status(404).send({ message: 'Task not found or access denied' });

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        taskId: task.id,
        authorId: parseInt(user.userId, 10),
      },
    });
    return reply.status(201).send(comment);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to create comment', error: errorMessage });
  }
}

// Get all comments for a task
export async function getComments(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId, taskId } = request.params as { boardId: string; listId: string; taskId: string };

  // Ownership and existence checks
  const board = await prisma.board.findFirst({
    where: { id: parseInt(boardId, 10), ownerId: parseInt(user.userId, 10) },
  });
  if (!board) return reply.status(404).send({ message: 'Board not found or access denied' });

  const list = await prisma.list.findFirst({
    where: { id: parseInt(listId, 10), boardId: board.id },
  });
  if (!list) return reply.status(404).send({ message: 'List not found or access denied' });

  const task = await prisma.task.findFirst({
    where: { id: parseInt(taskId, 10), listId: list.id },
  });
  if (!task) return reply.status(404).send({ message: 'Task not found or access denied' });

  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: task.id },
      orderBy: { createdAt: 'asc' },
    });
    return reply.send(comments);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to fetch comments', error: errorMessage });
  }
}

// Get a single comment by ID
export async function getComment(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId, taskId, commentId } = request.params as { boardId: string; listId: string; taskId: string; commentId: string };

  // Ownership and existence checks
  const board = await prisma.board.findFirst({
    where: { id: parseInt(boardId, 10), ownerId: parseInt(user.userId, 10) },
  });
  if (!board) return reply.status(404).send({ message: 'Board not found or access denied' });

  const list = await prisma.list.findFirst({
    where: { id: parseInt(listId, 10), boardId: board.id },
  });
  if (!list) return reply.status(404).send({ message: 'List not found or access denied' });

  const task = await prisma.task.findFirst({
    where: { id: parseInt(taskId, 10), listId: list.id },
  });
  if (!task) return reply.status(404).send({ message: 'Task not found or access denied' });

  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: parseInt(commentId, 10),
        taskId: task.id,
      },
    });
    if (!comment) return reply.status(404).send({ message: 'Comment not found' });
    return reply.send(comment);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to fetch comment', error: errorMessage });
  }
}

// Update a comment (only by author)
export async function updateComment(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId, taskId, commentId } = request.params as { boardId: string; listId: string; taskId: string; commentId: string };
  const { content } = request.body as { content: string };

  // Ownership and existence checks
  const board = await prisma.board.findFirst({
    where: { id: parseInt(boardId, 10), ownerId: parseInt(user.userId, 10) },
  });
  if (!board) return reply.status(404).send({ message: 'Board not found or access denied' });

  const list = await prisma.list.findFirst({
    where: { id: parseInt(listId, 10), boardId: board.id },
  });
  if (!list) return reply.status(404).send({ message: 'List not found or access denied' });

  const task = await prisma.task.findFirst({
    where: { id: parseInt(taskId, 10), listId: list.id },
  });
  if (!task) return reply.status(404).send({ message: 'Task not found or access denied' });

  const comment = await prisma.comment.findFirst({
    where: {
      id: parseInt(commentId, 10),
      taskId: task.id,
      authorId: parseInt(user.userId, 10),
    },
  });
  if (!comment) return reply.status(404).send({ message: 'Comment not found or not owned by user' });

  try {
    const updated = await prisma.comment.update({
      where: { id: comment.id },
      data: { content },
    });
    return reply.send(updated);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to update comment', error: errorMessage });
  }
}

// Delete a comment (only by author)
export async function deleteComment(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId, taskId, commentId } = request.params as { boardId: string; listId: string; taskId: string; commentId: string };

  // Ownership and existence checks
  const board = await prisma.board.findFirst({
    where: { id: parseInt(boardId, 10), ownerId: parseInt(user.userId, 10) },
  });
  if (!board) return reply.status(404).send({ message: 'Board not found or access denied' });

  const list = await prisma.list.findFirst({
    where: { id: parseInt(listId, 10), boardId: board.id },
  });
  if (!list) return reply.status(404).send({ message: 'List not found or access denied' });

  const task = await prisma.task.findFirst({
    where: { id: parseInt(taskId, 10), listId: list.id },
  });
  if (!task) return reply.status(404).send({ message: 'Task not found or access denied' });

  const comment = await prisma.comment.findFirst({
    where: {
      id: parseInt(commentId, 10),
      taskId: task.id,
      authorId: parseInt(user.userId, 10),
    },
  });
  if (!comment) return reply.status(404).send({ message: 'Comment not found or not owned by user' });

  try {
    await prisma.comment.delete({
      where: { id: comment.id },
    });
    return reply.send({ message: 'Comment deleted' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to delete comment', error: errorMessage });
  }
}
