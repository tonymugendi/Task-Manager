import { FastifyInstance } from 'fastify';
import { createBoard, getBoards, getBoard, updateBoard, deleteBoard } from '../controllers/board.controller';
import { authenticate } from '../middleware/auth';

export default async function boardRoutes(fastify: FastifyInstance) {
  fastify.post('/boards', { preHandler: authenticate }, createBoard);
  fastify.get('/boards', { preHandler: authenticate }, getBoards);
  fastify.get('/boards/:id', { preHandler: authenticate }, getBoard);
  fastify.put('/boards/:id', { preHandler: authenticate }, updateBoard);
  fastify.delete('/boards/:id', { preHandler: authenticate }, deleteBoard);
}