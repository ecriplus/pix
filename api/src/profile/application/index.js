import Joi from 'joi';

import { identifiersType } from '../../../src/shared/domain/types/identifiers-type.js';
import { securityPreHandlers } from '../../shared/application/security-pre-handlers.js';
import { attestationController } from './attestation-controller.js';
import { profileController } from './profile-controller.js';

const register = async function (server) {
  const adminRoutes = [
    {
      method: 'GET',
      path: '/api/admin/users/{id}/profile',
      config: {
        pre: [
          {
            method: (request, h) =>
              securityPreHandlers.hasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleCertif,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.userId,
          }),
        },
        handler: profileController.getProfileForAdmin,
        notes: [
          "- Permet à un administrateur de récupérer le nombre total de Pix d'un utilisateur\n et de ses scorecards",
        ],
        tags: ['api', 'user', 'profile'],
      },
    },
  ];

  const userRoutes = [
    {
      method: 'GET',
      path: '/api/users/{userId}/attestations/{attestationKey}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkRequestedUserIsAuthenticatedUser,
            assign: 'requestedUserIsAuthenticatedUser',
          },
        ],
        validate: {
          params: Joi.object({
            userId: identifiersType.userId,
            attestationKey: Joi.string(),
          }),
        },
        handler: attestationController.getUserAttestation,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération de l'attestation utilisateur" +
            '- L’id demandé doit correspondre à celui de l’utilisateur authentifié',
        ],
        tags: ['api', 'user', 'profile'],
      },
    },
    {
      method: 'GET',
      path: '/api/users/{id}/profile',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkRequestedUserIsAuthenticatedUser,
            assign: 'requestedUserIsAuthenticatedUser',
          },
        ],
        validate: {
          params: Joi.object({
            id: identifiersType.userId,
          }),
        },
        handler: profileController.getProfile,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            "- Récupération du nombre total de Pix de l'utilisateur\n et de ses scorecards" +
            '- L’id demandé doit correspondre à celui de l’utilisateur authentifié',
        ],
        tags: ['api', 'user', 'profile'],
      },
    },
    {
      method: 'POST',
      path: '/api/users/{userId}/profile/share-reward',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkRequestedUserIsAuthenticatedUser,
            assign: 'requestedUserIsAuthenticatedUser',
          },
        ],
        validate: {
          params: Joi.object({
            userId: identifiersType.userId,
          }),
          payload: Joi.object({
            data: {
              attributes: {
                campaignParticipationId: identifiersType.campaignParticipationId,
                profileRewardId: identifiersType.profileRewardId,
              },
            },
          }),
        },
        handler: profileController.shareProfileReward,
        notes: [
          "- Cette route permet à un utilisateur de partager l'obtention de son attestation avec une organisation\n",
        ],
        tags: ['api', 'user', 'profile', 'reward'],
      },
    },
  ];

  server.route([...adminRoutes, ...userRoutes]);
};

const name = 'profile-api';
export { name, register };
