import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import {
  createList,
  getLists,
  getList,
  updateList,
  deleteList
} from '../controllers/list.controller';

export default async function listRoutes(fastify: FastifyInstance) {
  fastify.post('/:boardId/lists', { preHandler: [authenticate] }, createList);
  fastify.get('/:boardId/lists', { preHandler: [authenticate] }, getLists);
  fastify.get('/:boardId/lists/:listId', { preHandler: [authenticate] }, getList);
  fastify.put('/:boardId/lists/:listId', { preHandler: [authenticate] }, updateList);
  fastify.delete('/:boardId/lists/:listId', { preHandler: [authenticate] }, deleteList);
}