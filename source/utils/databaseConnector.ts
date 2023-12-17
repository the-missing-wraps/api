import fastifyPlugin from 'fastify-plugin';
import fastifyMongo from '@fastify/mongodb';
import { FastifyPluginAsync } from 'fastify';

import CONFIG from '@/config.js';

const dbConnector: FastifyPluginAsync = async (fastify, _options) => {
    await fastify.register(fastifyMongo, {
        url: CONFIG.MONGODB.URI
    });
};

export default fastifyPlugin(dbConnector);
