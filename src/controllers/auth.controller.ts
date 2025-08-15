import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/hash';
import { signJwt } from '../utils/jwt';
import { registerSchema, loginSchema } from '../schemas/validation.schemas';
import { errors } from '../middleware/error.middleware';

const prisma = new PrismaClient();

// Type definitions for validated request bodies
type RegisterBody = {
  name?: string;
  email: string;
  password: string;
};

type LoginBody = {
  email: string;
  password: string;
};

export async function register(request: FastifyRequest, reply: FastifyReply) {
  // Validate request body
  const validatedData = registerSchema.parse(request.body);
  const { name, email, password } = validatedData as RegisterBody;

  // Check for existing user
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw errors.conflict('Email already in use');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  // Sign JWT
  const token = signJwt({ userId: user.id });

  return reply.send({ 
    success: true,
    message: 'User registered successfully',
    data: {
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      }
    }
  });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  // Validate request body
  const validatedData = loginSchema.parse(request.body);
  const { email, password } = validatedData as LoginBody;

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw errors.unauthorized('Invalid email or password');
  }

  // Verify password
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    throw errors.unauthorized('Invalid email or password');
  }

  // Sign JWT
  const token = signJwt({ userId: user.id });

  return reply.send({ 
    success: true,
    message: 'Login successful',
    data: {
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      }
    }
  });
}
