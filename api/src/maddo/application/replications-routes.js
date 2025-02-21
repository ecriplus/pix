import Joi from 'joi';

import { replicate } from './replications-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'POST',
      path: '/api/replications/{replicationName}',
      config: {
        auth: { access: { scope: 'replication' } },
        validate: {
          params: Joi.object({
            replicationName: Joi.string().max(255),
          }),
          query: Joi.object({
            async: Joi.boolean().default(true),
          }),
        },
        handler: replicate,
        notes: ['- Permet à une application de lancer une réplication entre le datawarehouse et le datamart'],
        tags: ['api', 'replications'],
      },
    },
  ]);
};

const name = 'admin-campaign-participation-api';
export { name, register };
