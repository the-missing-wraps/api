import Fastify from 'fastify';
import cors from '@fastify/cors';
import { pino } from 'pino';

import bodyParser from '@/utils/bodyParser.js';
import databaseConnector from '@/utils/databaseConnector.js';
import applicationRoutes from '@/routes/applicationsRoutes.js';

import CONFIG from '@/config.js';

const fastify = Fastify({
    logger: pino({ level: 'info' })
});

await fastify.register(cors);
bodyParser(fastify);
await fastify.register(databaseConnector);
await fastify.register(applicationRoutes, { prefix: '/api/applications' });

try {
    await fastify.listen({ port: CONFIG.API.PORT, host: CONFIG.API.HOST });
} catch (error) {
    fastify.log.error(error);
    throw error;
}
