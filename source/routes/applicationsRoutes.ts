import { FastifyPluginAsync } from 'fastify';
import { v4 as uuid } from 'uuid';
import { Application } from '@/types/index.js';

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
        '/',
        { schema: { body: applicationBodyJsonSchema } },
        async (request, _reply) => {
            const result = await collection.insertOne({ ...request.body, status: 'pending', token: uuid() });
            return result.insertedId;
        }
    );

    fastify.get<{ Params: { token: string } }>('/token/:token', async (request, reply) => {
        const result = await collection.findOne({ token: request.params.token });

        if (!result) {
            await reply.status(404).send('Not found');
            throw new Error('Not found');
        }

        return result;
    });

    fastify.put<{ Params: { token: string }; Body: ApplicationBody }>(
        '/token/:token',
        { schema: { body: applicationBodyJsonSchema } },
        async (request, _reply) => {
            await collection.updateOne({ token: request.params.token }, { $set: request.body });
        }
    );

    fastify.delete<{ Params: { token: string } }>('/token/:token', async (request, _reply) => {
        await collection.deleteOne({ token: request.params.token });
    });
};
export default routes;
