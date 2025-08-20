"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = exports.createError = exports.globalErrorHandler = void 0;
const validation_middleware_1 = require("./validation.middleware");
// Global error handler
const globalErrorHandler = (error, request, reply) => {
    const timestamp = new Date().toISOString();
    const path = request.url;
    // Log error for debugging (in production, use proper logging service)
    console.error(`[${timestamp}] ${error.name}: ${error.message}`, {
        path,
        method: request.method,
        stack: error.stack
    });
    // Validation errors (from our custom middleware)
    if (error instanceof validation_middleware_1.ValidationError) {
        const response = {
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
                const meta = error.meta;
                const target = (meta === null || meta === void 0 ? void 0 : meta.target) || [];
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
        const response = {
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
        const response = {
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
        const response = {
            error: 'Authentication Error',
            message: 'Invalid token',
            timestamp,
            path,
            statusCode: 401
        };
        return reply.status(401).send(response);
    }
    if (error.name === 'TokenExpiredError') {
        const response = {
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
        const details = error.validation.map((err) => ({
            field: err.instancePath || err.schemaPath,
            message: err.message,
            value: err.data
        }));
        const response = {
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
        const response = {
            error: error.name || 'HTTP Error',
            message: error.message,
            timestamp,
            path,
            statusCode: error.statusCode
        };
        return reply.status(error.statusCode).send(response);
    }
    // Default server error
    const response = {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        timestamp,
        path,
        statusCode: 500
    };
    return reply.status(500).send(response);
};
exports.globalErrorHandler = globalErrorHandler;
// Helper function to create custom HTTP errors
const createError = (statusCode, message, name) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.name = name || 'HTTPError';
    return error;
};
exports.createError = createError;
// Common error creators
exports.errors = {
    notFound: (resource = 'Resource') => (0, exports.createError)(404, `${resource} not found`, 'NotFoundError'),
    unauthorized: (message = 'Unauthorized access') => (0, exports.createError)(401, message, 'UnauthorizedError'),
    forbidden: (message = 'Access forbidden') => (0, exports.createError)(403, message, 'ForbiddenError'),
    conflict: (message = 'Resource conflict') => (0, exports.createError)(409, message, 'ConflictError'),
    badRequest: (message = 'Bad request') => (0, exports.createError)(400, message, 'BadRequestError')
};
