import { usecases } from '../domain/usecases/index.js';
import * as combinedCourseBlueprintSerializer from '../infrastructure/serializers/combined-course-blueprint-serializer.js';

export const findAll = async (request, _, dependencies = { combinedCourseBlueprintSerializer }) => {
  const combinedCourseBlueprints = await usecases.findCombinedCourseBlueprints();
  return dependencies.combinedCourseBlueprintSerializer.serialize(combinedCourseBlueprints);
};

export const save = async (request, h, dependencies = { combinedCourseBlueprintSerializer }) => {
  const combinedCourseBlueprint = await dependencies.combinedCourseBlueprintSerializer.deserialize(request.payload);
  const createdBlueprint = await usecases.createCombinedCourseBlueprint({ combinedCourseBlueprint });
  return h.response(dependencies.combinedCourseBlueprintSerializer.serialize(createdBlueprint)).created();
};

export const getById = async (request, _, dependencies = { combinedCourseBlueprintSerializer }) => {
  const combinedCourseBlueprint = await usecases.getCombinedCourseBlueprintById({ id: request.params.blueprintId });
  return dependencies.combinedCourseBlueprintSerializer.serialize(combinedCourseBlueprint);
};

export const detachOrganization = async (request, h) => {
  await usecases.detachOrganizationFromCombinedCourseBlueprint({
    combinedCourseBlueprintId: request.params.blueprintId,
    organizationId: request.params.organizationId,
  });
  return h.response().code(204);
};
