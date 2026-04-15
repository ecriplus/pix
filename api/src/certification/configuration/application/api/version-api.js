import { NotFoundError } from '../../../../shared/domain/errors.js';
import { Frameworks } from '../../../shared/domain/models/Frameworks.js';
import * as versionRepository from '../../infrastructure/repositories/version-repository.js';
import { Version } from './models/Version.js';

/**
 * @param {object} params
 * @param {Frameworks} params.framework
 * @param {Date} params.date
 * @returns {Promise<Version|null>}
 */
export async function getByFrameworkAndDate({ framework, date }) {
  const correctedFramework = framework === Frameworks.CLEA ? Frameworks.CORE : framework;
  if (!Object.values(Frameworks).includes(correctedFramework)) {
    return null;
  }

  const versions = await versionRepository.findAll();
  const foundVersion = versions.find((version) => {
    if (version.scope !== correctedFramework) return false;

    const isAfterStart = version.startDate <= date;
    const isBeforeExpiration = !version.expirationDate || version.expirationDate > date;

    return isAfterStart && isBeforeExpiration;
  });

  return foundVersion ? new Version(foundVersion) : null;
}

/**
 * @param {object} params
 * @param {number} params.id
 * @returns {Promise<Version|null>}
 */
export async function getById({ id }) {
  let foundVersion;
  try {
    foundVersion = await versionRepository.getById({ id });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return null;
    }
    throw err;
  }

  return new Version(foundVersion);
}
