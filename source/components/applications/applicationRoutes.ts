import { FastifyInstance } from 'fastify';

import * as applicationController from './applicationController.js';

function applicationsRoutes(app: FastifyInstance): void {
    app.get('/api/applications', applicationController.fetch);
    app.post('/api/applications', applicationController.create);
}

export default applicationsRoutes;
