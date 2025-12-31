import { Frameworks } from '../models/Frameworks.js';

/**
 * @param {object} params
 * @param {VersionsRepository} params.versionsRepository
 * @returns {Promise<Array<{id: string, name: string, versionStartDate: Date|null}>>}
 */
const findCertificationFrameworks = async function ({ versionsRepository }) {
  const frameworkNames = Object.values(Frameworks);

  const frameworksWithVersions = await Promise.all(
    frameworkNames.map(async (name) => {
      const activeVersion = await versionsRepository.findActiveByScope({ scope: name });

      return {
        id: name,
        name,
        activeVersionStartDate: activeVersion?.startDate ?? null,
      };
    }),
  );

  return frameworksWithVersions;
};

export { findCertificationFrameworks };
