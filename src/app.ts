import dotenv from "dotenv";
dotenv.config();
import Fastify from "fastify";
import authRoutes from './routes/auth.routes';
import boardRoutes from './routes/board.routes';
import listRoutes from './routes/list.routes';
import taskRoutes from './routes/task.routes';
import commentRoutes from './routes/comment.routes';
import FastifyCors from '@fastify/cors';

const fastify = Fastify({
    logger: true
})

fastify.register(FastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
})

fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(boardRoutes, { prefix: '/boards' });
fastify.register(listRoutes, { prefix: '/boards' });
fastify.register(taskRoutes, { prefix: '/boards' });
fastify.register(commentRoutes, { prefix: '/boards' });

fastify.setErrorHandler((error, request, reply) => {
    reply.status(500).send({ message: error.message || 'Internal server error' });
});

fastify.listen({ port: 3004, host: '0.0.0.0' }, (err, addr) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${addr}`)
})
    
