import { PrismaClient } from '../generated/prisma';
import { FastifyRequest, FastifyReply } from 'fastify';
import { createTaskSchema } from '../schemas/task.schema';
const prisma = new PrismaClient();

// Create a new task within a list
export async function createTask(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId } = request.params as { boardId: string; listId: string };

  const validateTask = createTaskSchema.safeParse(request.body);

  if (!validateTask.success) {
    return reply.status(400).send({ message: validateTask.error.message });
  }

  const { title, description, status, dueDate, position } = validateTask.data;

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

  // Ensure the list belongs to the board
  const list = await prisma.list.findFirst({
    where: {
      id: parseInt(listId, 10),
      boardId: board.id,
    },
  });
  if (!list) {
    return reply.status(404).send({ message: 'List not found or access denied' });
  }

  try {
    const task = await prisma.task.create({
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to create task', error: errorMessage });
  }
}

// Get all tasks for a list (owned by user)
export async function getTasks(request: FastifyRequest, reply: FastifyReply) {
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

  // Ensure the list belongs to the board
  const list = await prisma.list.findFirst({
    where: {
      id: parseInt(listId, 10),
      boardId: board.id,
    },
  });
  if (!list) {
    return reply.status(404).send({ message: 'List not found or access denied' });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { listId: list.id },
      orderBy: { position: 'asc' },
    });
    return reply.send(tasks);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to fetch tasks', error: errorMessage });
  }
}

// Get a single task by ID (within a list)
export async function getTask(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId, taskId } = request.params as { boardId: string; listId: string; taskId: string };

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

  // Ensure the list belongs to the board
  const list = await prisma.list.findFirst({
    where: {
      id: parseInt(listId, 10),
      boardId: board.id,
    },
  });
  if (!list) {
    return reply.status(404).send({ message: 'List not found or access denied' });
  }

  try {
    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(taskId, 10),
        listId: list.id,
      },
    });
    if (!task) {
      return reply.status(404).send({ message: 'Task not found' });
    }
    return reply.send(task);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to fetch task', error: errorMessage });
  }
}

// Update a task (within a list)
export async function updateTask(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId, taskId } = request.params as { boardId: string; listId: string; taskId: string };
  const { title, description, status, dueDate, position } = request.body as { title?: string; description?: string; status?: string; dueDate?: string; position?: number };

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

  // Ensure the list belongs to the board
  const list = await prisma.list.findFirst({
    where: {
      id: parseInt(listId, 10),
      boardId: board.id,
    },
  });
  if (!list) {
    return reply.status(404).send({ message: 'List not found or access denied' });
  }

  // Ensure the task exists and belongs to the list
  const task = await prisma.task.findFirst({
    where: {
      id: parseInt(taskId, 10),
      listId: list.id,
    },
  });
  if (!task) {
    return reply.status(404).send({ message: 'Task not found' });
  }

  try {
    const updated = await prisma.task.update({
      where: { id: task.id },
      data: {
        title: title ?? task.title,
        description: description ?? task.description,
        status: status ?? task.status,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        position: typeof position === 'number' ? position : task.position,
      },
    });
    return reply.send(updated);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to update task', error: errorMessage });
  }
}

// Delete a task (within a list)
export async function deleteTask(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const { boardId, listId, taskId } = request.params as { boardId: string; listId: string; taskId: string };

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

  // Ensure the list belongs to the board
  const list = await prisma.list.findFirst({
    where: {
      id: parseInt(listId, 10),
      boardId: board.id,
    },
  });
  if (!list) {
    return reply.status(404).send({ message: 'List not found or access denied' });
  }

  // Ensure the task exists and belongs to the list
  const task = await prisma.task.findFirst({
    where: {
      id: parseInt(taskId, 10),
      listId: list.id,
    },
  });
  if (!task) {
    return reply.status(404).send({ message: 'Task not found' });
  }

  try {
    await prisma.task.delete({
      where: { id: task.id },
    });
    return reply.send({ message: 'Task deleted' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply.status(500).send({ message: 'Failed to delete task', error: errorMessage });
  }
}
