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
const hash_1 = require("../../src/utils/hash");
describe('Hash Utils', () => {
    const testPassword = 'TestPassword123';
    describe('hashPassword', () => {
        it('should hash a password', () => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = yield (0, hash_1.hashPassword)(testPassword);
            expect(hashedPassword).toBeDefined();
            expect(typeof hashedPassword).toBe('string');
            expect(hashedPassword).not.toBe(testPassword);
            expect(hashedPassword.length).toBeGreaterThan(0);
        }));
        it('should create different hashes for the same password', () => __awaiter(void 0, void 0, void 0, function* () {
            const hash1 = yield (0, hash_1.hashPassword)(testPassword);
            const hash2 = yield (0, hash_1.hashPassword)(testPassword);
            // Due to salt, same password should produce different hashes
            expect(hash1).not.toBe(hash2);
        }));
        it('should handle empty password', () => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = yield (0, hash_1.hashPassword)('');
            expect(hashedPassword).toBeDefined();
            expect(typeof hashedPassword).toBe('string');
        }));
    });
    describe('verifyPassword', () => {
        it('should verify correct password', () => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = yield (0, hash_1.hashPassword)(testPassword);
            const isValid = yield (0, hash_1.verifyPassword)(testPassword, hashedPassword);
            expect(isValid).toBe(true);
        }));
        it('should reject incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = yield (0, hash_1.hashPassword)(testPassword);
            const isValid = yield (0, hash_1.verifyPassword)('WrongPassword', hashedPassword);
            expect(isValid).toBe(false);
        }));
        it('should reject empty password against hash', () => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = yield (0, hash_1.hashPassword)(testPassword);
            const isValid = yield (0, hash_1.verifyPassword)('', hashedPassword);
            expect(isValid).toBe(false);
        }));
        it('should handle case sensitivity', () => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = yield (0, hash_1.hashPassword)(testPassword);
            const isValid = yield (0, hash_1.verifyPassword)(testPassword.toLowerCase(), hashedPassword);
            expect(isValid).toBe(false);
        }));
    });
    describe('Hash roundtrip', () => {
        it('should maintain password verification through hash/verify cycle', () => __awaiter(void 0, void 0, void 0, function* () {
            const passwords = [
                'SimplePassword',
                'Complex@Password123!',
                '1234567890',
                'special-chars_&*()[]{}',
                'unicode-ñáéíóú'
            ];
            for (const password of passwords) {
                const hashedPassword = yield (0, hash_1.hashPassword)(password);
                const isValid = yield (0, hash_1.verifyPassword)(password, hashedPassword);
                expect(isValid).toBe(true);
            }
        }));
    });
});
