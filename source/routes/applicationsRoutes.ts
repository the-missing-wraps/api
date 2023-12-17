import { FastifyPluginAsync } from 'fastify';
import { v4 as uuid } from 'uuid';
import { Application, BookingDates, BookingDatesDetails } from '@/types/index.js';

import {
    applicationBodyJsonSchema,
    ApplicationBody,
    AssessBody,
    assessBodyJsonSchema
} from '@/schemas/applicationSchema.js';
import { arrayIncludesAnotherArray } from '@/utils/arrayIncludesAnotherArray.js';
import { mergeServiceTypes } from '@/utils/mergeServiceTypes.js';
import { MAX_SHARED_BOOKINGS } from '@/utils/thresholds.js';

// eslint-disable-next-line @typescript-eslint/require-await
const routes: FastifyPluginAsync = async (fastify, _options) => {
    const collection = fastify.mongo.db!.collection<Application>('applications');

    async function getBookingDates(): Promise<BookingDates> {
        const bookings = await collection
            .find({})
            .project({
                when: true,
                usage: true,
                serviceTypes: true,
                status: true
            })
            .toArray();
        return (bookings as any).reduce((acc: any, curr: any) => {
            for (const date of curr.when) {
                const dateString = date.toISOString().slice(10);
                const previousDate = acc[dateString] as BookingDatesDetails | undefined;

                acc[dateString] = {
                    usage: previousDate?.usage === 'exclusive' ? 'exclusive' : curr.usage,
                    serviceTypes: previousDate?.serviceTypes
                        ? mergeServiceTypes(previousDate.serviceTypes, curr.serviceTypes)
                        : curr.serviceTypes,
                    status: previousDate?.status === 'approved' ? previousDate.status : curr.status,
                    count: previousDate?.count ? previousDate.count++ : 1
                } as BookingDatesDetails;
            }
        }, {});
    }

    async function checkBooking(booking: Application): Promise<boolean> {
        const bookings = await getBookingDates();
        for (const date of booking.when) {
            const dateStr = date.toISOString().slice(10);
            const preexistendBooking = bookings[dateStr] as BookingDatesDetails | undefined;

            if (!preexistendBooking) {
                continue;
            }

            if (!arrayIncludesAnotherArray(booking.serviceTypes, preexistendBooking.serviceTypes)) {
                continue;
            }

            if (preexistendBooking.usage === 'exclusive' || booking.usage === 'exclusive') {
                return false;
            } else if (preexistendBooking.count >= MAX_SHARED_BOOKINGS) {
                return false;
            }
        }

        return true;
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

            if (!(await checkBooking({ ...application, status: 'pending' } as any))) {
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
        return getBookingDates();
    });
};
export default routes;
