/**
 * @typedef {import ('../../domain/usecases/index.js').ComplementaryCertificationRepository} ComplementaryCertificationRepository
 */

/**
 * @param {object} params
 * @param {ComplementaryCertificationRepository} params.complementaryCertificationRepository
 */
const findComplementaryCertifications = function ({ complementaryCertificationRepository }) {
  return complementaryCertificationRepository.findAll();
};

export { findComplementaryCertifications };
