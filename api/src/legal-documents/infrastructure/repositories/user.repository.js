import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';

/**
 * Updates the Pix terms of service acceptance status for a user.
 *
 * @param {string} userId - The ID of the user to update.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
const setPixOrgaCguByUserId = async (userId) => {
  const knexConnection = DomainTransaction.getConnection();
  await knexConnection('users').where('id', userId).update({
    pixOrgaTermsOfServiceAccepted: true,
    lastPixOrgaTermsOfServiceValidatedAt: new Date(),
  });
};

export { setPixOrgaCguByUserId };
