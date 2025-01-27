/**
 * @typedef {import('../../../../../src/shared/domain/events/CertificationCancelled.js'} CertificationCancelled
 * @typedef {import('./index.js'.LibServices} LibServices
 */

/**
 * @param {Object} params
 * @param {CertificationCancelled} params.certificationCancelledEvent
 * @param {LibServices} params.libServices
 */
export const execute = async ({ certificationCancelledEvent, libServices }) => {
  return libServices.handleCertificationRescoring({
    event: certificationCancelledEvent,
  });
};
