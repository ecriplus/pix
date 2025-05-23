import Joi from 'joi';

import { identifiersType } from '../../../shared/domain/types/identifiers-type.js';
import { assessmentAuthorization } from '../pre-handlers/assessment-authorization.js';
import { assessmentController } from './assessment-controller.js';

const register = async function (server) {
  const routes = [
    {
      method: 'PATCH',
      path: '/api/assessments/{id}/complete-assessment',
      config: {
        auth: false,
        pre: [
          {
            method: assessmentAuthorization.verify,
            assign: 'authorizationCheck',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.assessmentId,
          }),
        },
        handler: assessmentController.completeAssessment,
        tags: ['api'],
      },
    },
  ];
  server.route(routes);
};

const name = 'evaluation-assessments-api';
export { name, register };
