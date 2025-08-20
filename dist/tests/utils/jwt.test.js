"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../../src/utils/jwt");
describe('JWT Utils', () => {
    const testPayload = { userId: 123 };
    describe('signJwt', () => {
        it('should create a valid JWT token', () => {
            const token = (0, jwt_1.signJwt)(testPayload);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts separated by dots
        });
        it('should create different tokens for different payloads', () => {
            const token1 = (0, jwt_1.signJwt)({ userId: 1 });
            const token2 = (0, jwt_1.signJwt)({ userId: 2 });
            expect(token1).not.toBe(token2);
        });
    });
    describe('verifyJwt', () => {
        it('should verify a valid token', () => {
            const token = (0, jwt_1.signJwt)(testPayload);
            const decoded = (0, jwt_1.verifyJwt)(token);
            expect(decoded).toBeDefined();
            expect(decoded.userId).toBe(testPayload.userId);
        });
        it('should throw error for invalid token', () => {
            const invalidToken = 'invalid.token.here';
            expect(() => (0, jwt_1.verifyJwt)(invalidToken)).toThrow();
        });
        it('should throw error for malformed token', () => {
            const malformedToken = 'not-a-jwt-token';
            expect(() => (0, jwt_1.verifyJwt)(malformedToken)).toThrow();
        });
        it('should throw error for empty token', () => {
            expect(() => (0, jwt_1.verifyJwt)('')).toThrow();
        });
    });
    describe('JWT roundtrip', () => {
        it('should maintain payload integrity through sign/verify cycle', () => {
            const originalPayload = {
                userId: 456,
                email: 'test@example.com',
                role: 'user'
            };
            const token = (0, jwt_1.signJwt)(originalPayload);
            const decodedPayload = (0, jwt_1.verifyJwt)(token);
            expect(decodedPayload.userId).toBe(originalPayload.userId);
            expect(decodedPayload.email).toBe(originalPayload.email);
            expect(decodedPayload.role).toBe(originalPayload.role);
        });
    });
});
