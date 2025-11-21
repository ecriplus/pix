import { NotFoundError } from '../../../../shared/domain/errors.js';

/**
 * Frameworks scopes
 * @readonly
 * @enum {string}
 */
export const FrameworksEnum = Object.freeze({
  CORE: 'CORE',
  PIX_PLUS_DROIT: 'DROIT',
  PIX_PLUS_EDU_1ER_DEGRE: 'EDU_1ER_DEGRE',
  PIX_PLUS_EDU_2ND_DEGRE: 'EDU_2ND_DEGRE',
  PIX_PLUS_EDU_CPE: 'EDU_CPE',
  PIX_PLUS_PRO_SANTE: 'PRO_SANTE',
});

/**
 * Finds a framework by its name.
 * @param {string} name - The name of the framework to find.
 * @returns {string} The framework value.
 * @throws {NotFoundError} If the framework is not found.
 */
function findByName(name) {
  const framework = Object.values(FrameworksEnum).find((value) => value === name);
  if (!framework) {
    throw new NotFoundError(`Framework with name "${name}" not found.`);
  }
  return framework;
}

export const Frameworks = {
  ...FrameworksEnum,
  findByName,
};
