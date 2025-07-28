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

export { getByCode };
