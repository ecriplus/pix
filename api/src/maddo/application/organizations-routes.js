import { getOrganizations } from './organizations-controller.js';
import { organizationPreHandler } from './pre-handlers.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/organizations',
      config: {
        auth: { access: { scope: 'meta' } },
        pre: [organizationPreHandler],
        handler: getOrganizations,
        notes: ["- Retourne la liste des organizations auxquelles l'application client a droit"],
        tags: ['api', 'meta'],
      },
    },
  ]);
};

const name = 'maddo-meta-api';
export { name, register };
