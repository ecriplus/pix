import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { CombinedCourseBlueprint } from '../../domain/models/CombinedCourseBlueprint.js';

/**
 * @returns {Promise<import('../../domain/models/CombinedCourseBlueprint.js').CombinedCourseBlueprint[]>}
 */

export async function findAll() {
  const knexConn = DomainTransaction.getConnection();

  const results = await knexConn('combined_course_blueprints');
  return results.map((data) => new CombinedCourseBlueprint(data));
}

export async function save(combinedCourseBlueprint) {
  const knexConn = DomainTransaction.getConnection();
  const [insertedValues] = await knexConn('combined_course_blueprints')
    .insert({
      ...combinedCourseBlueprint,
      content: JSON.stringify(combinedCourseBlueprint.content),
    })
    .returning('*');

  return new CombinedCourseBlueprint(insertedValues);
}

export async function findById({ combinedCourseBlueprintId }) {
  const knexConn = DomainTransaction.getConnection();
  const result = await knexConn('combined_course_blueprints').where('id', combinedCourseBlueprintId).first();
  if (!result) {
    return null;
  }
  return new CombinedCourseBlueprint(result);
}
