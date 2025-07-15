import dotenv from "dotenv";
dotenv.config();
import Fastify from "fastify";
import { PrismaClient } from "./generated/prisma";
import authRoutes from './routes/auth.routes';


const prisma = new PrismaClient()

const fastify = Fastify({
    logger: true
})

fastify.register(authRoutes, { prefix: '/auth' });

// fastify.post('/users', async (request, reply) => {
//     const { name, email, password } = request.body as { name: string, email: string, password: string }
//     const user = await prisma.user.create({
//         data: {
//             name,
//             email,
//             password
//         }
//     })
//     return user
// })

// fastify.get('/users', async (request, reply) => {
//     return prisma.user.findMany()
// })

fastify.listen({ port: 3004 }, (err, addr) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${addr}`)
})
    
