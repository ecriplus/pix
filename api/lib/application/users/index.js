import Joi from 'joi';

import { securityPreHandlers } from '../../../src/shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../src/shared/domain/types/identifiers-type.js';
import { userController } from './user-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/users/{id}/trainings',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.userId,
          }),
        },
        pre: [
          {
            method: securityPreHandlers.checkRequestedUserIsAuthenticatedUser,
            assign: 'requestedUserIsAuthenticatedUser',
          },
        ],
        handler: userController.findPaginatedUserRecommendedTrainings,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Elle permet la récupération des contenus formatifs de l'utilisateur courant.",
        ],
        tags: ['api', 'user', 'trainings'],
      },
    },
  ]);
};

const name = 'users-api';
export { name, register };
