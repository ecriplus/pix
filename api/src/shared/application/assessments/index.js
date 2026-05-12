import Joi from 'joi';

import { assessmentAuthorization } from '../../../evaluation/application/pre-handlers/assessment-authorization.js';
import { identifiersType } from '../../domain/types/identifiers-type.js';
import { assessmentController } from './assessment-controller.js';

const register = async function (server) {
  const routes = [
    {
      method: 'GET',
      path: '/api/assessments/{id}',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.assessmentId,
          }),
        },
        pre: [
          {
            method: assessmentAuthorization.verify,
            assign: 'authorizationCheck',
          },
        ],
        handler: assessmentController.getAssessmentWithNextChallenge,
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/assessments/{id}/competence-evaluations',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.assessmentId,
          }),
        },
        handler: assessmentController.findCompetenceEvaluations,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération des competence-evaluations d'un assessment",
        ],
        tags: ['api', 'competence-evaluations'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/assessments/{id}/last-challenge-state/{state}',
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
            state: Joi.string().valid('asked', 'timeout', 'focusedout'),
          }),
          payload: Joi.object({
            data: Joi.object({
              attributes: Joi.object({
                'challenge-id': Joi.string().allow(null),
              }),
            }),
          }),
          options: {
            allowUnknown: true,
          },
        },
        handler: assessmentController.updateLastChallengeState,
        notes: [
          '- Sauvegarde la dernière question posée, ainsi que son état\n' +
            "- L'état doit être indiqué en paramètre, et la question optionnellement dans le payload.",
        ],
        tags: ['api', 'assessments'],
      },
    },
  ];

  server.route(routes);
};

const name = 'shared/assessments-api';
export { name, register };
