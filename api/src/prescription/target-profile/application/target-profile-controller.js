import { getChallengeLocale } from '../../../shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../domain/usecases/index.js';
import * as frameworkWithSkillsSerializer from '../infrastructure/serializers/jsonapi/framework-with-skills-serializer.js';
import * as targetProfileForSpecifierSerializer from '../infrastructure/serializers/jsonapi/target-profile-for-specifier-serializer.js';

const findTargetProfiles = async function (request, h, dependencies = { targetProfileForSpecifierSerializer }) {
  const organizationId = request.params.organizationId;
  const targetProfiles = await usecases.getAvailableTargetProfilesForOrganization({ organizationId });
  return dependencies.targetProfileForSpecifierSerializer.serialize(targetProfiles);
};

const findLearningContentsByOrganizationId = async function (
  request,
  _,
  dependencies = { frameworkWithSkillsSerializer },
) {
  const organizationId = request.params.organizationId;
  const locale = getChallengeLocale(request);
  const learningContents = await usecases.findLearningContentsByOrganizationId({ organizationId, locale });
  return dependencies.frameworkWithSkillsSerializer.serialize(learningContents);
};

const targetProfileController = {
  findLearningContentsByOrganizationId,
  findTargetProfiles,
};

export { targetProfileController };
