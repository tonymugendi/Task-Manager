import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const fastify = Fastify({
    logger: true
})

fastify.post('/users', async (request, reply) => {
    const { name, email, password } = request.body as { name: string, email: string, password: string }
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password
        }
    })
    return user
})

fastify.get('/users', async (request, reply) => {
    return prisma.user.findMany()
})

fastify.listen({ port: 3002 }, (err, addr) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${addr}`)
})
    
