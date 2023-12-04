import * as supLearnerListRoute from './application/sup-learner-list-route.js';
import * as scoLearnerListRoute from './application/sco-learner-list-route.js';
import * as learnerListRoute from './application/learner-list-route.js';

const learnerListRoutes = [supLearnerListRoute, scoLearnerListRoute, learnerListRoute];

export { learnerListRoutes };