import { Application } from '@/types/index.js';
import { FastifyPluginAsync } from 'fastify';

import applicationBodyJsonSchema, { ApplicationBody } from '@/schemas/applicationSchema.js';

// eslint-disable-next-line @typescript-eslint/require-await
const routes: FastifyPluginAsync = async (fastify, _options) => {
    const collection = fastify.mongo.db!.collection<Application>('applications');

    fastify.get('/', async (_request, _reply) => {
        return collection.find().toArray();
    });

    fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
        const id = new fastify.mongo.ObjectId(request.params.id);
        const result = await collection.findOne({ _id: id });

        if (!result) {
            await reply.status(404).send('Not found');
            throw new Error('Not found');
        }

        return result;
    });

    fastify.post<{ Body: ApplicationBody }>(
        '/applications',
        { schema: { body: applicationBodyJsonSchema } },
        async (request, _reply) => {
            return collection.insertOne({ ...request.body, status: 'pending' });
        }
    );
};
export default routes;
