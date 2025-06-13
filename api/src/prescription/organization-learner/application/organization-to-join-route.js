import Joi from 'joi';

import { organizationToJoinController } from './organization-to-join-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/organizations-to-join/{code}',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            code: Joi.string()
              .regex(/[^a-zA-Z0-9]/, { invert: true })
              .required(),
          }),
        },
        handler: organizationToJoinController.getOrganization,
        notes: [
          '- **Cette route est ouverte à tous les utilisateurs. **' +
            "- Elle permet de récupérer une organisation à rejoindre dans le cadre d'une campagne ou d'un combinix",
        ],
        tags: ['api', 'organization'],
      },
    },
  ]);
};

const name = 'organization-to-join';
export { name, register };
