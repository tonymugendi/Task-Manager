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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const auth_routes_1 = __importDefault(require("../../src/routes/auth.routes"));
const error_middleware_1 = require("../../src/middleware/error.middleware");
const testUtils_1 = require("../utils/testUtils");
describe('Auth Controller', () => {
    let app;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create Fastify instance for testing
        app = (0, fastify_1.default)({ logger: false });
        // Register CORS
        yield app.register(cors_1.default, {
            origin: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        });
        // Register auth routes
        yield app.register(auth_routes_1.default, { prefix: '/auth' });
        // Set error handler
        app.setErrorHandler(error_middleware_1.globalErrorHandler);
        // Ready the app
        yield app.ready();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean database before each test
        yield (0, testUtils_1.cleanDatabase)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up after all tests
        yield (0, testUtils_1.cleanDatabase)();
        yield testUtils_1.testPrisma.$disconnect();
        yield app.close();
    }));
    describe('POST /auth/register', () => {
        it('should register a new user with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = testUtils_1.testDataFactory.user();
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send(userData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User registered successfully');
            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.user.name).toBe(userData.name);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.password).toBeUndefined(); // Password should not be returned
        }));
        it('should fail to register with invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = testUtils_1.testDataFactory.user({ email: 'invalid-email' });
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body.error).toBe('Validation Error');
            expect(response.body.details).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'Invalid email format'
                })
            ]));
        }));
        it('should fail to register with weak password', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = testUtils_1.testDataFactory.user({ password: '123' });
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body.error).toBe('Validation Error');
            expect(response.body.details).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    field: 'password',
                    message: expect.stringContaining('Password must be at least 6 characters')
                })
            ]));
        }));
        it('should fail to register with password missing requirements', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = testUtils_1.testDataFactory.user({ password: 'password' }); // Missing uppercase and number
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send(userData)
                .expect(400);
            expect(response.body.error).toBe('Validation Error');
            expect(response.body.details).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    field: 'password',
                    message: expect.stringContaining('Password must contain at least one lowercase letter, one uppercase letter, and one number')
                })
            ]));
        }));
        it('should fail to register with duplicate email', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = testUtils_1.testDataFactory.user();
            // First registration should succeed
            yield (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send(userData)
                .expect(200);
            // Second registration with same email should fail
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send(userData)
                .expect(409);
            expect(response.body.error).toBe('ConflictError');
            expect(response.body.message).toBe('Email already in use');
        }));
        it('should fail to register with missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send({})
                .expect(400);
            expect(response.body.error).toBe('Validation Error');
            expect(response.body.details).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: expect.stringContaining('Required')
                }),
                expect.objectContaining({
                    field: 'password',
                    message: expect.stringContaining('Required')
                })
            ]));
        }));
    });
    describe('POST /auth/login', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // Create a test user for login tests
            const userData = testUtils_1.testDataFactory.user();
            yield (0, supertest_1.default)(app.server)
                .post('/auth/register')
                .send(userData);
        }));
        it('should login with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const loginData = {
                email: 'john@example.com',
                password: 'Password123'
            };
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/login')
                .send(loginData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data.user.email).toBe(loginData.email);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.password).toBeUndefined();
        }));
        it('should fail to login with invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'Password123'
            };
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/login')
                .send(loginData)
                .expect(401);
            expect(response.body.error).toBe('UnauthorizedError');
            expect(response.body.message).toBe('Invalid email or password');
        }));
        it('should fail to login with invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
            const loginData = {
                email: 'john@example.com',
                password: 'WrongPassword123'
            };
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/login')
                .send(loginData)
                .expect(401);
            expect(response.body.error).toBe('UnauthorizedError');
            expect(response.body.message).toBe('Invalid email or password');
        }));
        it('should fail to login with invalid email format', () => __awaiter(void 0, void 0, void 0, function* () {
            const loginData = {
                email: 'invalid-email',
                password: 'Password123'
            };
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/login')
                .send(loginData)
                .expect(400);
            expect(response.body.error).toBe('Validation Error');
            expect(response.body.details).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'Invalid email format'
                })
            ]));
        }));
        it('should fail to login with missing credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.server)
                .post('/auth/login')
                .send({})
                .expect(400);
            expect(response.body.error).toBe('Validation Error');
            expect(response.body.details).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: expect.stringContaining('Required')
                }),
                expect.objectContaining({
                    field: 'password',
                    message: expect.stringContaining('Required')
                })
            ]));
        }));
    });
});
