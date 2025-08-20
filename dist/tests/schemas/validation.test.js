"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_schemas_1 = require("../../src/schemas/validation.schemas");
describe('Validation Schemas', () => {
    describe('registerSchema', () => {
        it('should validate correct registration data', () => {
            const validData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Password123'
            };
            const result = validation_schemas_1.registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
        it('should reject invalid email format', () => {
            const invalidData = {
                email: 'invalid-email',
                password: 'Password123'
            };
            const result = validation_schemas_1.registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['email']);
                expect(result.error.issues[0].message).toBe('Invalid email format');
            }
        });
        it('should reject weak password', () => {
            const invalidData = {
                email: 'john@example.com',
                password: '123'
            };
            const result = validation_schemas_1.registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['password']);
                expect(result.error.issues[0].message).toContain('Password must be at least 6 characters');
            }
        });
        it('should reject password without required characters', () => {
            const invalidData = {
                email: 'john@example.com',
                password: 'password' // Missing uppercase and number
            };
            const result = validation_schemas_1.registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['password']);
                expect(result.error.issues[0].message).toContain('Password must contain at least one lowercase letter, one uppercase letter, and one number');
            }
        });
        it('should allow optional name field', () => {
            const validData = {
                email: 'john@example.com',
                password: 'Password123'
                // name is optional
            };
            const result = validation_schemas_1.registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });
    describe('loginSchema', () => {
        it('should validate correct login data', () => {
            const validData = {
                email: 'john@example.com',
                password: 'Password123'
            };
            const result = validation_schemas_1.loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
        it('should reject missing email', () => {
            const invalidData = {
                password: 'Password123'
            };
            const result = validation_schemas_1.loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['email']);
            }
        });
        it('should reject missing password', () => {
            const invalidData = {
                email: 'john@example.com'
            };
            const result = validation_schemas_1.loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['password']);
            }
        });
    });
    describe('createBoardSchema', () => {
        it('should validate correct board data', () => {
            const validData = {
                name: 'My Project Board',
                description: 'A board for my project'
            };
            const result = validation_schemas_1.createBoardSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
        it('should reject empty board name', () => {
            const invalidData = {
                name: '',
                description: 'A board for my project'
            };
            const result = validation_schemas_1.createBoardSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['name']);
                expect(result.error.issues[0].message).toBe('Board name is required');
            }
        });
        it('should reject board name that is too long', () => {
            const invalidData = {
                name: 'a'.repeat(101), // 101 characters
                description: 'A board for my project'
            };
            const result = validation_schemas_1.createBoardSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['name']);
                expect(result.error.issues[0].message).toBe('Board name too long');
            }
        });
        it('should trim whitespace from board name', () => {
            const dataWithWhitespace = {
                name: '  My Board  ',
                description: 'A board for my project'
            };
            const result = validation_schemas_1.createBoardSchema.safeParse(dataWithWhitespace);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.name).toBe('My Board');
            }
        });
        it('should allow optional description', () => {
            const validData = {
                name: 'My Board'
                // description is optional
            };
            const result = validation_schemas_1.createBoardSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });
    describe('createTaskSchema', () => {
        it('should validate correct task data', () => {
            const validData = {
                title: 'Complete project',
                description: 'Finish the task management project',
                dueDate: '2024-12-31T23:59:59.000Z',
                position: 0,
                assigneeId: 1
            };
            const result = validation_schemas_1.createTaskSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
        it('should reject empty task title', () => {
            const invalidData = {
                title: '',
                position: 0
            };
            const result = validation_schemas_1.createTaskSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['title']);
                expect(result.error.issues[0].message).toBe('Task title is required');
            }
        });
        it('should reject negative position', () => {
            const invalidData = {
                title: 'My Task',
                position: -1
            };
            const result = validation_schemas_1.createTaskSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['position']);
                expect(result.error.issues[0].message).toBe('Position must be non-negative');
            }
        });
        it('should reject invalid date format', () => {
            const invalidData = {
                title: 'My Task',
                dueDate: '2024-13-45', // Invalid date
                position: 0
            };
            const result = validation_schemas_1.createTaskSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['dueDate']);
                expect(result.error.issues[0].message).toBe('Invalid date format');
            }
        });
    });
    describe('idParamSchema', () => {
        it('should validate numeric ID string', () => {
            const validData = { id: '123' };
            const result = validation_schemas_1.idParamSchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.id).toBe(123);
                expect(typeof result.data.id).toBe('number');
            }
        });
        it('should reject non-numeric ID', () => {
            const invalidData = { id: 'abc' };
            const result = validation_schemas_1.idParamSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['id']);
                expect(result.error.issues[0].message).toBe('Invalid ID format');
            }
        });
        it('should reject empty ID', () => {
            const invalidData = { id: '' };
            const result = validation_schemas_1.idParamSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toEqual(['id']);
                expect(result.error.issues[0].message).toBe('Invalid ID format');
            }
        });
    });
});
