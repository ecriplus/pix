/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 * @typedef {import ('./index.js').TubeRepository} TubeRepository
 * @typedef {import ('./index.js').SkillRepository} SkillRepository
 * @typedef {import ('./index.js').ChallengeRepository} ChallengeRepository
 * @typedef {import ('./index.js').ConsolidatedFrameworkRepository} ConsolidatedFrameworkRepository
 */

import { FRENCH_FRANCE, FRENCH_SPOKEN } from '../../../../shared/domain/services/locale-service.js';
import { getVersionNumber } from '../services/get-version-number.js';

/**
 * @param {Object} params
 * @param {ComplementaryCertificationKeys} params.complementaryCertificationKey
 * @param {Array<string>} params.tubeIds
 * @param {TubeRepository} params.tubeRepository
 * @param {SkillRepository} params.skillRepository
 * @param {ChallengeRepository} params.challengeRepository
 * @param {ConsolidatedFrameworkRepository} params.consolidatedFrameworkRepository
 */
export const createConsolidatedFramework = async ({
  complementaryCertificationKey,
  tubeIds,
  tubeRepository,
  skillRepository,
  challengeRepository,
  consolidatedFrameworkRepository,
}) => {
  const tubes = await tubeRepository.findActiveByRecordIds(tubeIds, FRENCH_SPOKEN);

  const skillIds = tubes.flatMap((tube) => tube.skillIds);
  const skills = await skillRepository.findActiveByRecordIds(skillIds);

  const challenges = await challengeRepository.findValidatedBySkills(skills, FRENCH_FRANCE);

  return consolidatedFrameworkRepository.create({
    complementaryCertificationKey,
    challenges,
    version: getVersionNumber(),
  });
};
