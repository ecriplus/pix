import { Frameworks } from '../../../shared/domain/models/Frameworks.js';

/**
 * @param {object} params
 * @param {VersionRepository} params.versionRepository
 * @returns {Promise<Array<{id: string, name: string, versionStartDate: Date|null}>>}
 */
const findCertificationFrameworks = async function ({ versionRepository }) {
  const frameworkNames = Object.values(Frameworks);

  const frameworksWithVersions = await Promise.all(
    frameworkNames.map(async (name) => {
      const activeVersion = await versionRepository.findActiveByScope({ scope: name });

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
