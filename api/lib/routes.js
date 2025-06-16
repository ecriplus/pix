import * as healthcheck from '../src/shared/application/healthcheck/index.js';
import * as scoOrganizationLearners from './application/sco-organization-learners/index.js';

const routes = [healthcheck, scoOrganizationLearners];

export { routes };
