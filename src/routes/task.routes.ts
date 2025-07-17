import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller';

export default async function taskRoutes(fastify: FastifyInstance) {
  fastify.post('/:boardId/lists/:listId/tasks', { preHandler: [authenticate] }, createTask);
  fastify.get('/:boardId/lists/:listId/tasks', { preHandler: [authenticate] }, getTasks);
  fastify.get('/:boardId/lists/:listId/tasks/:taskId', { preHandler: [authenticate] }, getTask);
  fastify.put('/:boardId/lists/:listId/tasks/:taskId', { preHandler: [authenticate] }, updateTask);
  fastify.delete('/:boardId/lists/:listId/tasks/:taskId', { preHandler: [authenticate] }, deleteTask);
}
