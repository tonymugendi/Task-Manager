import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

// Custom error class for validation errors
export class ValidationError extends Error {
  public statusCode: number;
  public details: any[];

  constructor(message: string, details: any[]) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.details = details;
  }
}

// Middleware factory for body validation
export const validateBody = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body);
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        throw new ValidationError('Validation failed', details);
      }
      throw error;
    }
  };
};

// Middleware factory for params validation
export const validateParams = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.params = schema.parse(request.params);
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        throw new ValidationError('Invalid parameters', details);
      }
      throw error;
    }
  };
};

// Middleware factory for query validation
export const validateQuery = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.query = schema.parse(request.query);
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        throw new ValidationError('Invalid query parameters', details);
      }
      throw error;
    }
  };
};

// Combined validation middleware
export const validate = {
  body: validateBody,
  params: validateParams,
  query: validateQuery
};
