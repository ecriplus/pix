import { TargetProfileForCreation } from '../models/TargetProfileForCreation.js';

const createTargetProfile = async function ({ targetProfileCreationCommand, targetProfileAdministrationRepository }) {
  const targetProfileForCreation = TargetProfileForCreation.fromCreationCommand(targetProfileCreationCommand);

  return targetProfileAdministrationRepository.create({
    targetProfileForCreation,
  });
};

export { createTargetProfile };
