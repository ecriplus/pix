import * as complementaryCertificationBadgeRepository from '../../../certification/complementary-certification/infrastructure/repositories/complementary-certification-badge-repository.js';
import * as certificationChallengeLiveAlertRepository from '../../../certification/shared/infrastructure/repositories/certification-challenge-live-alert-repository.js';
import * as certificationCompanionAlertRepository from '../../../certification/shared/infrastructure/repositories/certification-companion-alert-repository.js';
import { evaluationUsecases } from '../../../evaluation/domain/usecases/index.js';
import * as badgeRepository from '../../../evaluation/infrastructure/repositories/badge-repository.js';
import * as answerRepository from '../../infrastructure/repositories/answer-repository.js';
import * as assessmentRepository from '../../infrastructure/repositories/assessment-repository.js';
import * as challengeRepository from '../../infrastructure/repositories/challenge-repository.js';
import * as competenceRepository from '../../infrastructure/repositories/competence-repository.js';
import * as courseRepository from '../../infrastructure/repositories/course-repository.js';
import { repositories as sharedInjectedRepositories } from '../../infrastructure/repositories/index.js';
import { injectDependencies } from '../../infrastructure/utils/dependency-injection.js';

const dependencies = {
  assessmentRepository,
  certificationCompanionAlertRepository,
  competenceRepository,
  answerRepository,
  courseRepository,
  complementaryCertificationBadgeRepository,
  certificationChallengeLiveAlertRepository,
  badgeRepository,
  challengeRepository,
  evaluationUsecases,
  ...sharedInjectedRepositories,
};

import { deleteUnassociatedBadge } from './delete-unassociated-badge.js';
import { getAssessment } from './get-assessment.js';
import { updateAssessmentWithNextChallenge } from './update-assessment-with-next-challenge.js';
import { updateLastQuestionState } from './update-last-question-state.js';

const usecasesWithoutInjectedDependencies = {
  deleteUnassociatedBadge,
  getAssessment,
  updateAssessmentWithNextChallenge,
  updateLastQuestionState,
};

const sharedUsecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { sharedUsecases };
