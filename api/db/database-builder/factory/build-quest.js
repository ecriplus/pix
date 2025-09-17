import isUndefined from 'lodash/isUndefined.js';

import { REWARD_TYPES } from '../../../src/quest/domain/constants.js';
import { databaseBuffer } from '../database-buffer.js';
import { buildAttestation } from './build-attestation.js';
import { buildOrganization } from './build-organization.js';

const buildQuest = function ({
  id = databaseBuffer.getNextId(),
  code = null,
  name = 'Ma quête',
  description = null,
  illustration = null,
  organizationId = null,
  createdAt = new Date(),
  updatedAt,
  rewardType = REWARD_TYPES.ATTESTATION,
  rewardId,
  eligibilityRequirements = [],
  successRequirements = [],
} = {}) {
  rewardId = isUndefined(rewardId) && rewardType === REWARD_TYPES.ATTESTATION ? buildAttestation().id : rewardId;
  const eligibilityRequirementsForDB = JSON.stringify(eligibilityRequirements);
  const successRequirementsForDB = JSON.stringify(successRequirements);

  const values = {
    id,
    code,
    name,
    description,
    illustration,
    organizationId,
    createdAt,
    updatedAt: updatedAt ?? createdAt,
    rewardType,
    rewardId,
    eligibilityRequirements: eligibilityRequirementsForDB,
    successRequirements: successRequirementsForDB,
  };

  const insertedValues = databaseBuffer.pushInsertable({
    tableName: 'quests',
    values,
  });
  return {
    ...insertedValues,
    eligibilityRequirements,
    successRequirements,
  };
};

const buildQuestForCombinedCourse = function ({
  code = 'COMBINIX1',
  name = 'Mon parcours combiné',
  organizationId,
  description = 'Le but de ma quête',
  illustration = 'images/illustration.svg',
  rewardId = null,
  rewardType = null,
  ...args
} = {}) {
  organizationId = isUndefined(organizationId) ? buildOrganization().id : organizationId;
  return buildQuest({ ...args, code, name, organizationId, description, illustration, rewardId, rewardType });
};

export { buildQuest, buildQuestForCombinedCourse };
