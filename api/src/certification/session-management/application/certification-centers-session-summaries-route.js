import Joi from 'joi';

import { certificationCenterController } from '../../../../src/certification/session-management/application/certification-centers-session-summaries-controller.js';
import { identifiersType } from '../../../shared/domain/types/identifiers-type.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/certification-centers/{id}/session-summaries',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.certificationCenterId,
          }),
          query: Joi.object({
            page: Joi.object({
              number: Joi.number().integer().empty('').allow(null).optional(),
              size: Joi.number().integer().empty('').allow(null).optional(),
            }).default({}),
          }),
        },
        handler: certificationCenterController.findPaginatedSessionSummaries,
        tags: ['api', 'certification-center'],
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n',
          '- Elle retourne les sessions rattachées au centre de certification.',
        ],
      },
    },
  ]);
};

const name = 'certification/session-management/session-summaries-api';
export { name, register };
