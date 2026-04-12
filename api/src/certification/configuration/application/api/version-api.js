import { Frameworks } from '../../../shared/domain/models/Frameworks.js';
import * as versionRepository from '../../infrastructure/repositories/version-repository.js';
import { Version } from './models/Version.js';

/**
 * @param {object} params
 * @param {Frameworks} params.framework
 * @param {Date} params.reconciliationDate
 * @returns {Promise<Version|null>}
 */
export async function getByFrameworkAndReconciliationDate({ framework, reconciliationDate }) {
  const correctedFramework = framework === Frameworks.CLEA ? Frameworks.CORE : framework;
  if (!Object.values(Frameworks).includes(correctedFramework)) {
    return null;
  }

  const versions = await versionRepository.findAll();
  const foundVersion = versions.find((version) => {
    if (version.scope !== correctedFramework) return false;

    const isAfterStart = version.startDate <= reconciliationDate;
    const isBeforeExpiration = !version.expirationDate || version.expirationDate > reconciliationDate;

    return isAfterStart && isBeforeExpiration;
  });

  return foundVersion ? new Version(foundVersion) : null;
}
