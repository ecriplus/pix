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
