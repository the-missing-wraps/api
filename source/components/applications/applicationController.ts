import { RouteHandler } from 'fastify';
import { Application } from './applicationModel.js';
import { RequestWithIdParam } from '../../types/index.js';

export const fetch: RouteHandler = async (_request, reply) => {
    try {
        const applications = await Application.find({});
        await reply.code(200).send(applications);
    } catch (error) {
        await reply.code(500).send(error);
    }
};

export const fetchOne: RouteHandler = async (request: RequestWithIdParam, reply) => {
    try {
        const applicationId = request.params.id;
        const application = await Application.findById(applicationId);
        await reply.code(200).send(application);
    } catch (error) {
        await reply.code(500).send(error);
    }
};

export const create: RouteHandler = async (request, reply) => {
    try {
        const applicationBody = request.body;
        const application = await Application.create(applicationBody);
        await reply.code(201).send(application._id);
    } catch (error) {
        await reply.code(500).send(error);
    }
};
