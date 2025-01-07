import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';

const TABLE_NAME = 'users';

/**
 * Updates the Pix terms of service acceptance status for a user.
 *
 * @param {string} userId - The ID of the user to update.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
const setPixOrgaCguByUserId = async (userId) => {
  const knexConnection = DomainTransaction.getConnection();
  await knexConnection(TABLE_NAME).where('id', userId).update({
    pixOrgaTermsOfServiceAccepted: true,
    lastPixOrgaTermsOfServiceValidatedAt: new Date(),
  });
};

/**
 * Retrieves the Pix terms of service acceptance status for a user.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<Object | null>} A promise that resolves to an object containing the acceptance status and the date of validation.
 */
const findPixOrgaCgusByUserId = async (userId) => {
  const knexConnection = DomainTransaction.getConnection();
  const userPixOrgaCgus = await knexConnection(TABLE_NAME)
    .select('pixOrgaTermsOfServiceAccepted', 'lastPixOrgaTermsOfServiceValidatedAt')
    .where('id', userId)
    .first();

  if (!userPixOrgaCgus) return null;

  return userPixOrgaCgus;
};

export { findPixOrgaCgusByUserId, setPixOrgaCguByUserId };
