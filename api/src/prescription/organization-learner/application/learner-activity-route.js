import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);
import { securityPreHandlers } from '../../../shared/application/security-pre-handlers.js';
import { identifiersType } from '../../../../lib/domain/types/identifiers-type.js';
import { learnerActivityController } from './learner-activity-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/organization-learners/{id}/activity',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserBelongsToLearnersOrganization,
            assign: 'belongsToLearnersOrganization',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.organizationLearnerId,
          }),
        },
        handler: learnerActivityController.getActivity,
        notes: [
          "- **Cette route est restreinte aux membres authentifiés d'une organisation**\n" +
            "- Récupération de l'activité du prescrit\n",
        ],
        tags: ['api', 'organization-learners-activity'],
      },
    },
  ]);
};

const name = 'learner-activity-api';

export { register, name };