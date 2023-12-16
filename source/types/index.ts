import { FastifyRequest } from 'fastify';

export type Usage = 'shared' | 'exclusive';
export type ServiceType = 'Intersection' | 'Parking';
export type Status = 'pending' | 'approved' | 'rejected';

export type RequestWithIdParam = FastifyRequest<{
    Params: { id: string };
}>;
