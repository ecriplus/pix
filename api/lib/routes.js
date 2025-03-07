import * as healthcheck from '../src/shared/application/healthcheck/index.js';
import * as authentication from './application/authentication/index.js';
import * as campaignParticipations from './application/campaign-participations/index.js';
import * as certificationCenterMemberships from './application/certification-center-memberships/index.js';
import * as frameworks from './application/frameworks/index.js';
import * as organizations from './application/organizations/index.js';
import * as scoOrganizationLearners from './application/sco-organization-learners/index.js';
import * as users from './application/users/index.js';

const routes = [
  authentication,
  campaignParticipations,
  certificationCenterMemberships,
  healthcheck,
  organizations,
  scoOrganizationLearners,
  frameworks,
  users,
];

export { routes };
