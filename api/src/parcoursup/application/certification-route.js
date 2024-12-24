import Joi from 'joi';

import { studentIdentifierType } from '../../shared/domain/types/identifiers-type.js';
import { certificationController } from './certification-controller.js';

const register = async function (server) {
  server.route({
    method: 'GET',
    path: '/api/parcoursup/students/{ine}/certification',
    config: {
      auth: 'jwt-parcoursup',
      validate: {
        params: Joi.object({
          ine: studentIdentifierType,
        }),
      },
      handler: certificationController.getCertificationResult,
      tags: ['api', 'parcoursup'],
      notes: [
        '- **Cette route est accessible uniquement à Parcours Sup**\n' +
          '- Récupère les informations de la dernière certification de l‘année en cours pour l‘élève identifié via son INE',
      ],
    },
  });
};

const name = 'parcoursup-api';
export { name, register };
