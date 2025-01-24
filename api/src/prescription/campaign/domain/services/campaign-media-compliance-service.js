import * as tubeRepository from '../../../../shared/infrastructure/repositories/tube-repository.js';
import * as targetProfileAdministrationRepository from '../../../target-profile/infrastructure/repositories/target-profile-administration-repository.js';

const getMediaCompliance = async (
  campaign,
  locale,
  dependencies = {
    targetProfileAdministrationRepository,
    tubeRepository,
  },
) => {
  const targetProfileTubes = await dependencies.targetProfileAdministrationRepository.getTubesByTargetProfileId(
    campaign.targetProfileId,
  );
  const tubes = await dependencies.tubeRepository.findActiveByRecordIds(
    targetProfileTubes.map(({ tubeId }) => tubeId),
    locale,
  );

  const isMobileCompliant = tubes.every((tube) => tube.isMobileCompliant);
  const isTabletCompliant = tubes.every((tube) => tube.isTabletCompliant);

  return { isMobileCompliant, isTabletCompliant };
};

export { getMediaCompliance };
