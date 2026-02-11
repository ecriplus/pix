import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { fetchPage } from '../../../shared/infrastructure/utils/knex-utils.js';
import { CombinedCourse } from '../../domain/models/CombinedCourse.js';

const getByCode = async ({ code }) => {
  const knexConn = DomainTransaction.getConnection();

  const combinedCourse = await knexConn('combined_courses')
    .select('id', 'organizationId', 'code', 'name', 'description', 'illustration', 'questId')
    .where('code', code)
    .first();
  if (!combinedCourse) {
    throw new NotFoundError(`Le parcours combiné portant le code ${code} n'existe pas`);
  }

  return _toDomain(combinedCourse);
};

const getById = async ({ id }) => {
  const knexConn = DomainTransaction.getConnection();

  const combinedCourse = await knexConn('combined_courses')
    .select('id', 'organizationId', 'code', 'name', 'description', 'illustration', 'questId')
    .where('id', id)
    .whereNotNull('organizationId')
    .whereNotNull('code')
    .first();
  if (!combinedCourse) {
    throw new NotFoundError(`Le parcours combiné pour l'id ${id} n'existe pas`);
  }

  return _toDomain(combinedCourse);
};

const findByOrganizationId = async ({ organizationId, page, size }) => {
  const knexConn = DomainTransaction.getConnection();

  const queryBuilder = knexConn('combined_courses')
    .select('id', 'organizationId', 'code', 'name', 'description', 'illustration', 'questId')
    .where('organizationId', organizationId)
    .orderBy('createdAt', 'desc');

  const { results, pagination } = await fetchPage({
    queryBuilder,
    paginationParams: { number: page, size },
  });

  return {
    combinedCourses: results.map(_toDomain),
    meta: pagination,
  };
};

const findByCampaignId = async ({ campaignId }) => {
  const knexConn = DomainTransaction.getConnection();
  const combinedCourses = await knexConn('combined_courses')
    .select(
      'combined_courses.id',
      'combined_courses.organizationId',
      'combined_courses.code',
      'combined_courses.name',
      'combined_courses.description',
      'combined_courses.illustration',
      'questId',
    )
    .join('quests', 'quests.id', 'combined_courses.questId')
    .where('combined_courses.organizationId', knexConn('campaigns').select('organizationId').where('id', campaignId))
    .whereJsonSupersetOf('quests.successRequirements', [{ data: { campaignId: { data: campaignId } } }]);

  return combinedCourses.map(_toDomain);
};

const targetProfileIdsPartOfAnyCombinedCourse = async ({ targetProfileIds }) => {
  const knexConn = DomainTransaction.getConnection();
  return knexConn('campaigns')
    .select('campaigns.targetProfileId')
    .whereIn('campaigns.targetProfileId', targetProfileIds)
    .whereIn(
      'campaigns.id',
      knexConn('quests').select(
        knexConn.raw('jsonb_path_query("successRequirements", \'$.data.campaignId.data\')::integer'),
      ),
    )
    .pluck('campaigns.targetProfileId');
};

const saveInBatch = async ({ combinedCourses, questRepository }) => {
  const knexConn = DomainTransaction.getConnection();
  const combinedCoursesToSave = combinedCourses.map(_toDTO);
  const questsToSave = combinedCourses.map((combinedCourse) => combinedCourse.quest);
  const questIds = await questRepository.saveInBatch({ quests: questsToSave });

  for (let i = 0; i < questIds.length; i++) {
    await knexConn('combined_courses').insert({ ...combinedCoursesToSave[i], questId: questIds[i] });
  }
};

const save = async ({ combinedCourse, questRepository }) => {
  const knexConn = DomainTransaction.getConnection();
  const combinedCourseToSave = _toDTO(combinedCourse);
  const questId = await questRepository.save({ quest: combinedCourse.quest });
  const [{ id: createdCombinedCourseId }] = await knexConn('combined_courses')
    .insert({ ...combinedCourseToSave, questId })
    .returning('id');

  return getById({ id: createdCombinedCourseId });
};

const _toDTO = (combinedCourse) => {
  return {
    combinedCourseBlueprintId: combinedCourse.blueprintId,
    organizationId: combinedCourse.organizationId,
    code: combinedCourse.code,
    name: combinedCourse.name,
    description: combinedCourse.description,
    illustration: combinedCourse.illustration,
  };
};

const findByModuleIdAndOrganizationIds = async ({ moduleId, organizationIds }) => {
  const knexConn = DomainTransaction.getConnection();
  const combinedCourses = await knexConn('combined_courses')
    .select(
      'combined_courses.id',
      'combined_courses.organizationId',
      'combined_courses.code',
      'combined_courses.name',
      'combined_courses.description',
      'combined_courses.illustration',
      'combined_courses.questId',
      'combined_courses.combinedCourseBlueprintId',
    )
    .join('quests', 'combined_courses.questId', 'quests.id')
    .whereIn('combined_courses.organizationId', organizationIds)
    .whereJsonSupersetOf('quests.successRequirements', [{ data: { moduleId: { data: moduleId } } }]);

  return combinedCourses.map(_toDomain);
};

const _toDomain = ({
  id,
  organizationId,
  code,
  name,
  description,
  illustration,
  questId,
  combinedCourseBlueprintId,
}) => {
  return new CombinedCourse({
    id,
    organizationId,
    code,
    name,
    description,
    illustration,
    questId,
    blueprintId: combinedCourseBlueprintId,
  });
};

export {
  findByCampaignId,
  findByModuleIdAndOrganizationIds,
  findByOrganizationId,
  getByCode,
  getById,
  save,
  saveInBatch,
  targetProfileIdsPartOfAnyCombinedCourse,
};
