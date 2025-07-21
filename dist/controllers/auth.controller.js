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
exports.register = register;
exports.login = login;
const prisma_1 = require("../generated/prisma");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const prisma = new prisma_1.PrismaClient();
function register(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = request.body;
        // Check for existing user
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return reply.status(400).send({ message: 'Email already in use' });
        }
        // Hash password
        const hashedPassword = yield (0, hash_1.hashPassword)(password);
        // Create user
        const user = yield prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        // Sign JWT
        const token = (0, jwt_1.signJwt)({ userId: user.id });
        return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
}
function login(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = request.body;
        // Find user
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return reply.status(401).send({ message: 'Invalid email or password' });
        }
        // Verify password
        const valid = yield (0, hash_1.verifyPassword)(password, user.password);
        if (!valid) {
            return reply.status(401).send({ message: 'Invalid email or password' });
        }
        // Sign JWT
        const token = (0, jwt_1.signJwt)({ userId: user.id });
        return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
}
