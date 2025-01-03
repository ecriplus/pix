import Joi from 'joi';

import { studentIdentifierType } from '../../shared/domain/types/identifiers-type.js';
import { responseObjectErrorDoc } from '../../shared/infrastructure/open-api-doc/response-object-error-doc.js';
import { certificationController } from './certification-controller.js';

const register = async function (server) {
  server.route({
    method: 'GET',
    path: '/api/parcoursup/certification/search',
    config: {
      auth: 'jwt-parcoursup',
      validate: {
        query: Joi.alternatives().try(
          Joi.object({
            ine: studentIdentifierType,
          }),
          Joi.object({
            organizationUai: Joi.string().required(),
            lastName: Joi.string().required(),
            firstName: Joi.string().required(),
            birthdate: Joi.string().required(),
          }),
          Joi.object({
            verificationCode: Joi.string()
              .regex(/^P-[a-zA-Z0-9]{8}$/)
              .required(),
            lastName: Joi.string().required(),
            firstName: Joi.string().required(),
          }),
        ),
      },
      handler: certificationController.getCertificationResult,
      tags: ['api', 'parcoursup'],
      notes: [
        '- **Cette route est accessible uniquement à Parcoursup**\n' +
          '- Récupère la dernière certification de l‘année en cours pour l‘élève identifié via ses informations',
      ],
      response: {
        failAction: 'log',
        status: {
          200: Joi.object({
            organizationUai: Joi.string().description('UAI de l‘établissement scolaire'),
            ine: Joi.string().description('INE de l‘élève'),
            lastName: Joi.string().description('Nom de famille de l‘élève'),
            firstName: Joi.string().description('Prénom de l‘élève'),
            birthdate: Joi.date().description('Date de naissance au format AAAA-MM-JJ'),
            status: Joi.string().description('Statut de la certification'),
            pixScore: Joi.number().min(0).max(1024).description('Score en nombre de pix'),
            certificationDate: Joi.date().description('Date de passage de la certification'),
            competences: Joi.array()
              .items(
                Joi.object({
                  id: Joi.string().description('Identifiant unique de la compétence'),
                  level: Joi.number().min(0).max(8).description('Niveau obtenu sur la compétence'),
                }).label('Competence-Result-Object'),
              )
              .description('Résultats par compétence')
              .label('Competence-Results-Array'),
          }).label('Certification-Result-Object'),
          401: responseObjectErrorDoc,
          403: responseObjectErrorDoc,
          404: responseObjectErrorDoc,
        },
      },
    },
  });
};
const name = 'parcoursup-api';
export { name, register };
