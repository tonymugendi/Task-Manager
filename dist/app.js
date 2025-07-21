"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fastify_1 = __importDefault(require("fastify"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const board_routes_1 = __importDefault(require("./routes/board.routes"));
const list_routes_1 = __importDefault(require("./routes/list.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const fastify = (0, fastify_1.default)({
    logger: true
});
fastify.register(auth_routes_1.default, { prefix: '/auth' });
fastify.register(board_routes_1.default, { prefix: '/boards' });
fastify.register(list_routes_1.default, { prefix: '/boards' });
fastify.register(task_routes_1.default, { prefix: '/boards' });
fastify.register(comment_routes_1.default, { prefix: '/boards' });
fastify.setErrorHandler((error, request, reply) => {
    reply.status(500).send({ message: error.message || 'Internal server error' });
});
fastify.listen({ port: 3004 }, (err, addr) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`server listening on ${addr}`);
});
