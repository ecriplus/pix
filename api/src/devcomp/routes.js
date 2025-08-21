import * as campaignParticipationRoute from './application/campaign-participations/campaign-participation-route.js';
import * as modulesRoutes from './application/modules/module-route.js';
import * as passageEvents from './application/passage-events/passage-event-route.js';
import * as passages from './application/passages/passage-route.js';
import * as trainings from './application/trainings/training-route.js';
import * as tutorialEvaluations from './application/tutorial-evaluations/tutorial-evaluations-route.js';
import * as userTrainings from './application/user-trainings/user-trainings-route.js';
import * as userTutorials from './application/user-tutorials/user-tutorials-route.js';

const devcompRoutes = [
  campaignParticipationRoute,
  modulesRoutes,
  passages,
  passageEvents,
  trainings,
  userTutorials,
  tutorialEvaluations,
  userTrainings,
];

export { devcompRoutes };
