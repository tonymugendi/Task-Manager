import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ValidationError } from './validation.middleware';
import { Prisma } from '@prisma/client';

// Custom error response interface
interface ErrorResponse {
  error: string;
  message: string;
  details?: any[];
  timestamp: string;
  path: string;
  statusCode: number;
}

// Global error handler
export const globalErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const timestamp = new Date().toISOString();
  const path = request.url;

  // Log error for debugging (in production, use proper logging service)
  console.error(`[${timestamp}] ${error.name}: ${error.message}`, {
    path,
    method: request.method,
    stack: error.stack
  });

  // Validation errors (from our custom middleware)
  if (error instanceof ValidationError) {
    const response: ErrorResponse = {
      error: 'Validation Error',
      message: error.message,
      details: error.details,
      timestamp,
      path,
      statusCode: 400
    };
    return reply.status(400).send(response);
  }

  // Prisma database errors
  if (error.code && typeof error.code === 'string') {
    let message = 'Database error occurred';
    let statusCode = 500;

    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const meta = (error as any).meta;
        const target = meta?.target as string[] || [];
        message = `${target.join(', ')} already exists`;
        statusCode = 409;
        break;
      case 'P2025':
        // Record not found
        message = 'Record not found';
        statusCode = 404;
        break;
      case 'P2003':
        // Foreign key constraint violation
        message = 'Referenced record does not exist';
        statusCode = 400;
        break;
      case 'P2014':
        // Required relation missing
        message = 'Required relation is missing';
        statusCode = 400;
        break;
    }

    const response: ErrorResponse = {
      error: 'Database Error',
      message,
      timestamp,
      path,
      statusCode
    };
    return reply.status(statusCode).send(response);
  }

  // Prisma validation errors
  if (error.name === 'PrismaClientValidationError') {
    const response: ErrorResponse = {
      error: 'Database Validation Error',
      message: 'Invalid data provided to database',
      timestamp,
      path,
      statusCode: 400
    };
    return reply.status(400).send(response);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    const response: ErrorResponse = {
      error: 'Authentication Error',
      message: 'Invalid token',
      timestamp,
      path,
      statusCode: 401
    };
    return reply.status(401).send(response);
  }

  if (error.name === 'TokenExpiredError') {
    const response: ErrorResponse = {
      error: 'Authentication Error',
      message: 'Token has expired',
      timestamp,
      path,
      statusCode: 401
    };
    return reply.status(401).send(response);
  }

  // Fastify validation errors (built-in)
  if (error.validation) {
    const details = error.validation.map((err: any) => ({
      field: err.instancePath || err.schemaPath,
      message: err.message,
      value: err.data
    }));

    const response: ErrorResponse = {
      error: 'Request Validation Error',
      message: 'Invalid request format',
      details,
      timestamp,
      path,
      statusCode: 400
    };
    return reply.status(400).send(response);
  }

  // HTTP errors (like 404, 403, etc.)
  if (error.statusCode) {
    const response: ErrorResponse = {
      error: error.name || 'HTTP Error',
      message: error.message,
      timestamp,
      path,
      statusCode: error.statusCode
    };
    return reply.status(error.statusCode).send(response);
  }

  // Default server error
  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    timestamp,
    path,
    statusCode: 500
  };

  return reply.status(500).send(response);
};

// Helper function to create custom HTTP errors
export const createError = (statusCode: number, message: string, name?: string) => {
  const error = new Error(message) as FastifyError;
  error.statusCode = statusCode;
  error.name = name || 'HTTPError';
  return error;
};

// Common error creators
export const errors = {
  notFound: (resource: string = 'Resource') => 
    createError(404, `${resource} not found`, 'NotFoundError'),
  
  unauthorized: (message: string = 'Unauthorized access') => 
    createError(401, message, 'UnauthorizedError'),
  
  forbidden: (message: string = 'Access forbidden') => 
    createError(403, message, 'ForbiddenError'),
  
  conflict: (message: string = 'Resource conflict') => 
    createError(409, message, 'ConflictError'),
  
  badRequest: (message: string = 'Bad request') => 
    createError(400, message, 'BadRequestError')
};
