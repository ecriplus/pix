import Joi from 'joi';

import { securityPreHandlers } from '../../../src/shared/application/security-pre-handlers.js';
import { responseAuthenticationDoc } from '../../../src/shared/infrastructure/open-api-doc/authentication/response-authentication-doc.js';
import { responseObjectErrorDoc } from '../../../src/shared/infrastructure/open-api-doc/response-object-error-doc.js';
import { authenticationController } from './authentication-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'POST',
      path: '/api/application/token',
      config: {
        auth: false,
        payload: {
          allow: 'application/x-www-form-urlencoded',
        },
        plugins: {
          'hapi-swagger': {
            payloadType: 'form',
            produces: ['application/json'],
            consumes: ['application/x-www-form-urlencoded'],
          },
        },
        validate: {
          payload: Joi.object()
            .required()
            .keys({
              grant_type: Joi.string()
                .valid('client_credentials')
                .required()
                .description("Grant type should be 'client_credentials'"),
              client_id: Joi.string().required().description('Client identification'),
              client_secret: Joi.string().required().description('Client secret for the corresponding identification'),
              scope: Joi.string().required().description('Scope to access data'),
            })
            .label('AuthorizationPayload'),
        },
        notes: ["- **API pour récupérer le token à partir d'un client ID et client secret**\n"],
        response: {
          failAction: 'log',
          status: {
            200: responseAuthenticationDoc,
            401: responseObjectErrorDoc,
            403: responseObjectErrorDoc,
          },
        },
        handler: authenticationController.authenticateApplication,
        tags: ['api', 'authorization-server', 'parcoursup'],
      },
    },
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
