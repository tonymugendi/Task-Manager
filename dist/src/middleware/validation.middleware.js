"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateQuery = exports.validateParams = exports.validateBody = exports.ValidationError = void 0;
const zod_1 = require("zod");
// Custom error class for validation errors
class ValidationError extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
        this.details = details;
    }
}
exports.ValidationError = ValidationError;
// Middleware factory for body validation
const validateBody = (schema) => {
    return (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            request.body = schema.parse(request.body);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }));
                throw new ValidationError('Validation failed', details);
            }
            throw error;
        }
    });
};
exports.validateBody = validateBody;
// Middleware factory for params validation
const validateParams = (schema) => {
    return (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            request.params = schema.parse(request.params);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }));
                throw new ValidationError('Invalid parameters', details);
            }
            throw error;
        }
    });
};
exports.validateParams = validateParams;
// Middleware factory for query validation
const validateQuery = (schema) => {
    return (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            request.query = schema.parse(request.query);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }));
                throw new ValidationError('Invalid query parameters', details);
            }
            throw error;
        }
    });
};
exports.validateQuery = validateQuery;
// Combined validation middleware
exports.validate = {
    body: exports.validateBody,
    params: exports.validateParams,
    query: exports.validateQuery
};
