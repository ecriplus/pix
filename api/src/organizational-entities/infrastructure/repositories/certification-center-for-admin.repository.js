import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { CenterForAdmin } from '../../domain/models/CenterForAdmin.js';

const save = async function (certificationCenter) {
  const knexConn = DomainTransaction.getConnection();
  const [certificationCenterCreated] = await knexConn('certification-centers').returning('*').insert({
    name: certificationCenter.name,
    type: certificationCenter.type,
    externalId: certificationCenter.externalId,
  });
  return _toDomain(certificationCenterCreated);
};

const update = async function (certificationCenter) {
  const knexConn = DomainTransaction.getConnection();
  return knexConn('certification-centers')
    .update({
      name: certificationCenter.name,
      type: certificationCenter.type,
      externalId: certificationCenter.externalId,
    })
    .where({ id: certificationCenter.id });
};

export { save, update };

function _toDomain(certificationCenterDTO) {
  return new CenterForAdmin({
    center: {
      id: certificationCenterDTO.id,
      type: certificationCenterDTO.type,
      habilitations: [],
      name: certificationCenterDTO.name,
      externalId: certificationCenterDTO.externalId,
      createdAt: certificationCenterDTO.createdAt,
      updatedAt: certificationCenterDTO.updatedAt,
      isComplementaryAlonePilot: undefined,
    },
  });
}
