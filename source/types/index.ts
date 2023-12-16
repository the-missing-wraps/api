import { FastifyRequest } from 'fastify';

export type Usage = 'shared' | 'exclusive';
export type TestEnvironment = 'Intersection' | 'Parking';

export type RequestWithIdParam = FastifyRequest<{
    Params: { id: string };
}>;
