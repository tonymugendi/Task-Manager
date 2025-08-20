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
exports.testDataFactory = exports.createAuthHeader = exports.generateTestToken = exports.createTestTask = exports.createTestList = exports.createTestBoard = exports.createTestUser = exports.cleanDatabase = exports.testPrisma = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../../src/utils/jwt");
// Test database instance
exports.testPrisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
// Clean up database before/after tests
const cleanDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const tablenames = yield exports.testPrisma.$queryRaw `SELECT tablename FROM pg_tables WHERE schemaname='public'`;
    const tables = tablenames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== '_prisma_migrations')
        .map((name) => `"public"."${name}"`)
        .join(', ');
    try {
        yield exports.testPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    }
    catch (error) {
        console.log({ error });
    }
});
exports.cleanDatabase = cleanDatabase;
// Create test user helper
const createTestUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: '$2b$10$rQj9pGx7Zt5Z9Yt5Z9Yt5O9Yt5Z9Yt5Z9Yt5Z9Yt5Z9Yt5Z9Yt5Z', // hashed "password123"
    };
    const user = yield exports.testPrisma.user.create({
        data: Object.assign(Object.assign({}, defaultUser), userData)
    });
    return user;
});
exports.createTestUser = createTestUser;
// Create test board helper
const createTestBoard = (ownerId, boardData) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultBoard = {
        name: 'Test Board',
        description: 'A test board',
    };
    const board = yield exports.testPrisma.board.create({
        data: Object.assign(Object.assign(Object.assign({}, defaultBoard), boardData), { ownerId })
    });
    return board;
});
exports.createTestBoard = createTestBoard;
// Create test list helper
const createTestList = (boardId, listData) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultList = {
        name: 'Test List',
        position: 0,
    };
    const list = yield exports.testPrisma.list.create({
        data: Object.assign(Object.assign(Object.assign({}, defaultList), listData), { boardId })
    });
    return list;
});
exports.createTestList = createTestList;
// Create test task helper
const createTestTask = (listId, taskData) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultTask = {
        title: 'Test Task',
        description: 'A test task',
        position: 0,
    };
    const task = yield exports.testPrisma.task.create({
        data: Object.assign(Object.assign(Object.assign({}, defaultTask), taskData), { listId })
    });
    return task;
});
exports.createTestTask = createTestTask;
// Generate test JWT token
const generateTestToken = (userId) => {
    return (0, jwt_1.signJwt)({ userId });
};
exports.generateTestToken = generateTestToken;
// Create authorization header
const createAuthHeader = (userId) => {
    const token = (0, exports.generateTestToken)(userId);
    return { Authorization: `Bearer ${token}` };
};
exports.createAuthHeader = createAuthHeader;
// Test data factories
exports.testDataFactory = {
    user: (overrides) => (Object.assign({ name: 'John Doe', email: 'john@example.com', password: 'Password123' }, overrides)),
    board: (overrides) => (Object.assign({ name: 'My Board', description: 'A sample board' }, overrides)),
    list: (overrides) => (Object.assign({ name: 'To Do', position: 0 }, overrides)),
    task: (overrides) => (Object.assign({ title: 'Sample Task', description: 'A sample task description', position: 0 }, overrides)),
    comment: (overrides) => (Object.assign({ content: 'This is a test comment' }, overrides))
};
