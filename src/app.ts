import Fastify from "fastify";

const fastify = Fastify({
    logger: true
})

fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

fastify.listen({ port: 3002 }, (err, addr) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${addr}`)
})
    
