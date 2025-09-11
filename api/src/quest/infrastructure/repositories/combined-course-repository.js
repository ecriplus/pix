import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { CombinedCourse } from '../../domain/models/CombinedCourse.js';

const getByCode = async ({ code }) => {
  const knexConn = DomainTransaction.getConnection();

  const quest = await knexConn('quests').select('id', 'organizationId', 'code', 'name').where('code', code).first();
  if (!quest) {
    throw new NotFoundError(`Le parcours combiné portant le code ${code} n'existe pas`);
  }

  return new CombinedCourse(quest);
};

const getById = async ({ id }) => {
  const knexConn = DomainTransaction.getConnection();

  const quest = await knexConn('quests')
    .select('id', 'organizationId', 'code', 'name')
    .where('id', id)
    .whereNotNull('organizationId')
    .whereNotNull('code')
    .first();
  if (!quest) {
    throw new NotFoundError(`Le parcours combiné pour l'id ${id} n'existe pas`);
  }

  return new CombinedCourse(quest);
};

const findByCampaignId = async ({ campaignId }) => {
  const knexConn = DomainTransaction.getConnection();
  const quests = await knexConn('quests')
    .select('id', 'organizationId', 'code', 'name')
    .whereNotNull('code')
    .whereJsonSupersetOf('successRequirements', [{ data: { campaignId: { data: campaignId } } }]);

  return quests.map((quest) => new CombinedCourse(quest));
};

const saveInBatch = async ({ combinedCourses }) => {
  const knexConn = DomainTransaction.getConnection();
  const combinedCoursesToSave = combinedCourses.map(_toDTO);
  await knexConn('quests').insert(combinedCoursesToSave);
};

const _toDTO = (combinedCourse) => {
  const questDTO = combinedCourse.quest.toDTO();
  return {
    ...questDTO,
    id: combinedCourse.id,
    organizationId: combinedCourse.organizationId,
    code: combinedCourse.code,
    name: combinedCourse.name,
    eligibilityRequirements: JSON.stringify([]),
    successRequirements: JSON.stringify(questDTO.successRequirements),
  };
};

export { findByCampaignId, getByCode, getById, saveInBatch };
