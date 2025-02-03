/**
 * @typedef {import('../../../../../src/shared/domain/events/CertificationCancelled.js'} CertificationCancelled
 * @typedef {import('../../../../../src/shared/domain/events/CertificationUncancelled.js'} CertificationUncancelled
 * @typedef {import('./index.js'.LibServices} LibServices
 */

/**
 * @param {Object} params
 * @param {CertificationCancelled|CertificationUncancelled} params.event
 * @param {LibServices} params.libServices
 */
export const execute = async ({ event, libServices }) => {
  return libServices.handleCertificationRescoring({
    event,
  });
};
