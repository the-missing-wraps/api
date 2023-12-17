import { FastifyInstance } from 'fastify';

export default function bodyParser(fastify: FastifyInstance): void {
    fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (_req, body: string, done) {
        try {
            const json = JSON.parse(body);
            done(null, json);
        } catch (error) {
            error.statusCode = 400;
            done(error);
        }
    });
}
