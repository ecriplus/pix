import { buildCampaigns } from './build-campaigns.js';
import { buildCombinedCourseBlueprints, buildCombinedCourses } from './build-combined-courses.js';
import { buildOrganizationLearners } from './build-learners.js';
import { buildOrganizationLearnersWithMultipleParticipations } from './build-organization-learners-with-multiple-participations.js';
import { buildPlacesLots } from './build-places-lots.js';
import { buildQuests } from './build-quests.js';
import { buildTargetProfiles } from './build-target-profiles.js';

async function teamPrescriptionDataBuilder({ databaseBuilder }) {
  await buildTargetProfiles(databaseBuilder);
  await buildCampaigns(databaseBuilder);
  await buildOrganizationLearners(databaseBuilder);
  await buildPlacesLots(databaseBuilder);
  await buildQuests(databaseBuilder);
  await buildCombinedCourses(databaseBuilder);
  await buildCombinedCourseBlueprints(databaseBuilder);
  await buildOrganizationLearnersWithMultipleParticipations(databaseBuilder);
}

export { teamPrescriptionDataBuilder };
