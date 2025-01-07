import { buildCampaigns } from './build-campaigns.js';
import { createDevcompOrganization } from './build-organization.js';
import { createDevcompOrganizationLearners } from './build-organization-learners.js';
import { buildTargetProfiles } from './build-target-profiles.js';
import { buildTrainings } from './build-trainings.js';

async function teamDevcompDataBuilder({ databaseBuilder }) {
  await createDevcompOrganization(databaseBuilder);
  const learnersCount = await createDevcompOrganizationLearners(databaseBuilder);
  await databaseBuilder.commit();

  await buildTargetProfiles(databaseBuilder);
  const trainingsIds = await buildTrainings(databaseBuilder);
  await buildCampaigns(databaseBuilder, trainingsIds, learnersCount);
}

export { teamDevcompDataBuilder };
