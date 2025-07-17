import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment
} from '../controllers/comment.controller';

export default async function commentRoutes(fastify: FastifyInstance) {
  fastify.post('/:boardId/lists/:listId/tasks/:taskId/comments', { preHandler: [authenticate] }, createComment);
  fastify.get('/:boardId/lists/:listId/tasks/:taskId/comments', { preHandler: [authenticate] }, getComments);
  fastify.get('/:boardId/lists/:listId/tasks/:taskId/comments/:commentId', { preHandler: [authenticate] }, getComment);
  fastify.put('/:boardId/lists/:listId/tasks/:taskId/comments/:commentId', { preHandler: [authenticate] }, updateComment);
  fastify.delete('/:boardId/lists/:listId/tasks/:taskId/comments/:commentId', { preHandler: [authenticate] }, deleteComment);
}
