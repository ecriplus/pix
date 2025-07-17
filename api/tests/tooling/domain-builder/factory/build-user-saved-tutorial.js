import { UserSavedTutorial } from '../../../../src/devcomp/domain/models/UserSavedTutorial.js';
import { buildSkill } from './build-skill.js';
import { buildTutorial } from './build-tutorial.js';
import { buildUser } from './build-user.js';

const buildUserSavedTutorial = function ({
  id = 123,
  userId = buildUser().id,
  skillId = buildSkill().id,
  tutorialId = buildTutorial().id,
  createdAt = '2022-05-02',
} = {}) {
  return new UserSavedTutorial({
    id,
    skillId,
    userId,
    tutorialId,
    createdAt,
  });
};

export { buildUserSavedTutorial };
