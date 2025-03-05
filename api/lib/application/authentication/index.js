import Joi from 'joi';

import { securityPreHandlers } from '../../../src/shared/application/security-pre-handlers.js';
import { authenticationController } from './authentication-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'POST',
      path: '/api/token-from-external-user',
      config: {
        auth: false,
        validate: {
          payload: Joi.object({
            data: {
              type: Joi.string().valid('external-user-authentication-requests').required(),
              attributes: {
                username: Joi.string().required(),
                password: Joi.string().required(),
                'external-user-token': Joi.string().required(),
                'expected-user-id': Joi.number().positive().required(),
              },
            },
          }),
        },
        pre: [{ method: securityPreHandlers.checkIfUserIsBlocked }],
        handler: authenticationController.authenticateExternalUser,
        notes: [
          '- Cette route permet d’authentifier un utilisateur Pix provenant de la double mire GAR.\n' +
            '- Elle renvoie un objet contenant un access token.',
        ],
        tags: ['api'],
      },
    },
  ]);
};

const name = 'authentication-api-old';
export { name, register };
