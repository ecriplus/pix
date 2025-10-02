import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { CombinedCourse } from '../../domain/models/CombinedCourse.js';

const getByCode = async ({ code }) => {
  const knexConn = DomainTransaction.getConnection();

  const quest = await knexConn('quests')
    .select('id', 'organizationId', 'code', 'name', 'description', 'illustration')
    .where('code', code)
    .first();
  if (!quest) {
    throw new NotFoundError(`Le parcours combiné portant le code ${code} n'existe pas`);
  }

  return new CombinedCourse(quest);
};

const getById = async ({ id }) => {
  const knexConn = DomainTransaction.getConnection();

  const quest = await knexConn('quests')
    .select('id', 'organizationId', 'code', 'name', 'description', 'illustration')
    .where('id', id)
    .whereNotNull('organizationId')
    .whereNotNull('code')
    .first();
  if (!quest) {
    throw new NotFoundError(`Le parcours combiné pour l'id ${id} n'existe pas`);
  }

  return new CombinedCourse(quest);
};

const findByOrganizationId = async ({ organizationId }) => {
  const knexConn = DomainTransaction.getConnection();

  const combinedCourses = await knexConn('quests')
    .select('id', 'organizationId', 'code', 'name', 'description', 'illustration')
    .where('organizationId', organizationId);

  return combinedCourses.map((quest) => new CombinedCourse(quest));
};

const findByCampaignId = async ({ campaignId }) => {
  const knexConn = DomainTransaction.getConnection();
  const quests = await knexConn('quests')
    .select('id', 'organizationId', 'code', 'name', 'description', 'illustration')
    .whereNotNull('code')
    .whereJsonSupersetOf('successRequirements', [{ data: { campaignId: { data: campaignId } } }]);

  return quests.map((quest) => new CombinedCourse(quest));
};

const saveInBatch = async ({ combinedCourses }) => {
  const knexConn = DomainTransaction.getConnection();
  const combinedCoursesToSave = combinedCourses.map(_toDTO);
  for (const combinedCourseToSave of combinedCoursesToSave) {
    const [{ id: questId }] = await knexConn('quests')
      .insert({ ...combinedCourseToSave.quest, ...combinedCourseToSave.combinedCourse })
      .returning('id');
    await knexConn('combined_courses').insert({ ...combinedCourseToSave.combinedCourse, questId });
  }
};

const _toDTO = (combinedCourse) => {
  const questDTO = combinedCourse.quest.toDTO();
  return {
    quest: {
      ...questDTO,
      id: combinedCourse.id,
      eligibilityRequirements: JSON.stringify([]),
      successRequirements: JSON.stringify(questDTO.successRequirements),
    },
    combinedCourse: {
      organizationId: combinedCourse.organizationId,
      code: combinedCourse.code,
      name: combinedCourse.name,
      description: combinedCourse.description,
      illustration: combinedCourse.illustration,
    },
  };
};

export { findByCampaignId, findByOrganizationId, getByCode, getById, saveInBatch };
