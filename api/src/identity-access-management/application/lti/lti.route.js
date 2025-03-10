import { ltiController } from './lti.controller.js';

export const ltiRoutes = [
  {
    method: 'GET',
    path: '/api/lti/keys',
    options: {
      auth: false,
      cache: false,
      handler: (request, h) => ltiController.listPublicKeys(request, h),
      notes: ['Cette route renvoie une liste contenant les public keys des plateformes actives'],
      tags: ['identity-access-management', 'api', 'lti'],
    },
  },
];
