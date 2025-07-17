import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyJwt } from '../utils/jwt';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyJwt<{ userId: string }>(token);
  if (!payload) {
    return reply.status(401).send({ message: 'Invalid or expired token' });
  }

  // Attach user info to request for downstream handlers
  (request as any).user = payload;
}
