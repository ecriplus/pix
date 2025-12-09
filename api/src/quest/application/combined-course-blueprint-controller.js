import { usecases } from '../domain/usecases/index.js';
import * as combinedCourseBlueprintSerializer from '../infrastructure/serializers/combined-course-blueprint-serializer.js';

export const findAll = async (request, _, dependencies = { combinedCourseBlueprintSerializer }) => {
  const combinedCourseBlueprints = await usecases.findCombinedCourseBlueprints();
  return dependencies.combinedCourseBlueprintSerializer.serialize(combinedCourseBlueprints);
};
