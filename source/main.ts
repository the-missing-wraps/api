import Fastify from 'fastify';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import { pino } from 'pino';
import CONFIG from '@/config.js';

import applicationsRoutes from '@/components/applications/applicationRoutes.js';

try {
    await mongoose.connect(CONFIG.MONGODB.URI);
} catch (error) {
    console.error(error);
}

const app = Fastify({
    logger: pino({ level: 'info' })
});

await app.register(cors);

app.addContentTypeParser('application/json', { parseAs: 'string' }, function (_req, body: string, done) {
    try {
        const json = JSON.parse(body);
        done(null, json);
    } catch (error) {
        error.statusCode = 400;
        done(error);
    }
});

applicationsRoutes(app);

try {
    await app.listen({ port: CONFIG.API.PORT, host: CONFIG.API.HOST });
} catch (error) {
    app.log.error(error);
    throw error;
}
