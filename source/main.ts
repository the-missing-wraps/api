import Fastify from 'fastify';
import { pino } from 'pino';

const fastify = Fastify({
    logger: pino({ level: 'info' })
});

fastify.get('/applications', function handler(_request, _reply) {
    return { hello: 'world' };
});

try {
    await fastify.listen({ port: 3000 });
} catch (error) {
    fastify.log.error(error);
    throw error;
}
