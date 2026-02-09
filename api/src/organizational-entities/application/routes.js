import * as administrationTeamAdminRoutes from './administration-team/administration-team.admin.route.js';
import * as certificationCenterAdminRoutes from './certification-center/certification-center.admin.route.js';
import * as organizationAdminRoutes from './organization/organization.admin.route.js';
import * as organizationLearnerTypeAdminRoutes from './organization-learner-type/organization-learner-type.admin.route.js';
import * as tagAdminRoutes from './tag/tag.admin.route.js';

const organizationalEntitiesRoutes = [
  certificationCenterAdminRoutes,
  organizationAdminRoutes,
  administrationTeamAdminRoutes,
  organizationLearnerTypeAdminRoutes,
  tagAdminRoutes,
];

export { organizationalEntitiesRoutes };
