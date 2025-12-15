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
