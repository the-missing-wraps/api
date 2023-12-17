import { FastifyPluginAsync } from 'fastify';
import { v4 as uuid } from 'uuid';
import { Application, Booking } from '@/types/index.js';

import {
    applicationBodyJsonSchema,
    ApplicationBody,
    AssessBody,
    assessBodyJsonSchema
} from '@/schemas/applicationSchema.js';
import { arrayIncludesAnotherArray } from '@/utils/arrayIncludesAnotherArray.js';

// eslint-disable-next-line @typescript-eslint/require-await
const routes: FastifyPluginAsync = async (fastify, _options) => {
    const collection = fastify.mongo.db!.collection<Application>('applications');

    async function getBookings(): Promise<Booking[]> {
        return await (collection
            .find({})
            .project({
                when: true,
                usage: true,
                serviceTypes: true,
                status: true
            })
            .toArray() as any);
    }

    async function checkBooking(booking: Booking): Promise<boolean> {
        if (booking.usage === 'shared') {
            return false;
        }

        const bookings = await getBookings();
        bookings.some(
            element =>
                element.status === 'pending' &&
                element.usage === 'exclusive' &&
                arrayIncludesAnotherArray(element.serviceTypes, booking.serviceTypes) &&
                arrayIncludesAnotherArray(element.when, booking.when)
        );
        return bookings.length > 0;
    }

    fastify.get('/', async (_request, _reply) => {
        return collection
            .find({
                status: { $ne: 'rejected' }
            })
            .toArray();
    });

    fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
        const id = new fastify.mongo.ObjectId(request.params.id);
        const result = await collection.findOne({ _id: id, status: { $ne: 'rejected' } });

        if (!result) {
            await reply.status(404).send('Not found');
            throw new Error('Not found');
        }

        return result;
    });

    fastify.post<{ Body: ApplicationBody }>(
        '/',
        { schema: { body: applicationBodyJsonSchema } },
        async (request, reply) => {
            const application: Application = { ...request.body, status: 'pending', token: uuid() };
            if (!(await checkBooking(application))) {
                await reply.status(400).send('Application has conflict');
                throw new Error('Application has conflict');
            }
            const result = await collection.insertOne(application);
            return result.insertedId;
        }
    );

    fastify.get<{ Params: { token: string } }>('/token/:token', async (request, reply) => {
        const result = await collection.findOne({ token: request.params.token, status: 'pending' });

        if (!result) {
            await reply.status(404).send('Not found');
            throw new Error('Not found');
        }

        return result;
    });

    fastify.put<{ Params: { token: string }; Body: ApplicationBody }>(
        '/token/:token',
        { schema: { body: applicationBodyJsonSchema } },
        async (request, reply) => {
            const application: ApplicationBody = request.body;

            if (!(await checkBooking({ ...application, status: 'pending' }))) {
                await reply.status(400).send('Application has conflict');
                throw new Error('Application has conflict');
            }

            await collection.updateOne({ token: request.params.token, status: 'pending' }, { $set: application });
        }
    );

    fastify.delete<{ Params: { token: string } }>('/token/:token', async (request, _reply) => {
        await collection.deleteOne({ token: request.params.token });
    });

    fastify.post<{ Params: { id: string }; Body: AssessBody }>(
        '/:id/assess',
        { schema: { body: assessBodyJsonSchema } },
        async (request, _reply) => {
            const id = new fastify.mongo.ObjectId(request.params.id);
            return collection.updateOne({ _id: id, status: 'pending' }, { $set: { status: request.body.status } });
        }
    );

    fastify.get('/bookings', async (_request, _reply) => {
        return getBookings();
    });
};
export default routes;
