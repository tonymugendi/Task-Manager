import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '../generated/prisma';
import { hashPassword, verifyPassword } from '../utils/hash';
import { signJwt } from '../utils/jwt';

const prisma = new PrismaClient();

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = request.body as { name?: string; email: string; password: string };

  // Check for existing user
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return reply.status(400).send({ message: 'Email already in use' });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  // Sign JWT
  const token = signJwt({ userId: user.id });

  return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string; password: string };

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return reply.status(401).send({ message: 'Invalid email or password' });
  }

  // Verify password
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return reply.status(401).send({ message: 'Invalid email or password' });
  }

  // Sign JWT
  const token = signJwt({ userId: user.id });

  return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
}
