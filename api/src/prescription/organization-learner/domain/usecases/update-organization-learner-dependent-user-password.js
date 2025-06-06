import lodash from 'lodash';

import { UserNotAuthorizedToUpdatePasswordError } from '../../../../shared/domain/errors.js';

const { isEmpty } = lodash;

const updateOrganizationLearnerDependentUserPassword = async function ({
  organizationId,
  organizationLearnerId,
  userId,
  cryptoService,
  passwordGenerator,
  authenticationMethodRepository,
  prescriptionOrganizationLearnerRepository,
  userRepository,
}) {
  const userWithMemberships = await userRepository.getWithMemberships(userId);
  const organizationLearner = await prescriptionOrganizationLearnerRepository.getLearnerInfo(organizationLearnerId);

  if (
    !userWithMemberships.hasAccessToOrganization(organizationId) ||
    organizationLearner.organizationId !== organizationId
  ) {
    throw new UserNotAuthorizedToUpdatePasswordError(
      `L'utilisateur ${userId} n'est pas autorisé à modifier le mot de passe des élèves de l'organisation ${organizationId} car il n'y appartient pas.`,
    );
  }

  const userStudent = await userRepository.get(organizationLearner.userId);
  if (isEmpty(userStudent.username) && isEmpty(userStudent.email)) {
    throw new UserNotAuthorizedToUpdatePasswordError(
      `Le changement de mot de passe n'est possible que si l'élève (utilisateur:  ${organizationLearner.userId}) utilise les méthodes d'authentification email ou identifiant.`,
    );
  }

  const generatedPassword = passwordGenerator.generateSimplePassword();
  const hashedPassword = await cryptoService.hashPassword(generatedPassword);

  await authenticationMethodRepository.updatePassword({
    userId: userStudent.id,
    hashedPassword,
    shouldChangePassword: true,
  });

  return { generatedPassword, organizationLearnerId };
};

export { updateOrganizationLearnerDependentUserPassword };
