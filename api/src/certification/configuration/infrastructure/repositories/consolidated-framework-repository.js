/**
 * @typedef {import ('../../../shared/domain/models/ComplementaryCertificationKeys.js').ComplementaryCertificationKeys} ComplementaryCertificationKeys
 */
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';

export async function getFrameworkHistory({ complementaryCertificationKey }) {
  const knexConn = DomainTransaction.getConnection();

  const frameworks = await knexConn('certification-frameworks-challenges')
    .select('version')
    .distinct('version')
    .where({ complementaryCertificationKey })
    .orderBy('version', 'desc');

  return frameworks.map(({ version }) => version);
}
