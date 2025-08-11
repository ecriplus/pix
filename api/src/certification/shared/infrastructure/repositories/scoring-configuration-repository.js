import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../shared/domain/errors.js';
import * as areaRepository from '../../../../shared/infrastructure/repositories/area-repository.js';
import * as competenceRepository from '../../../../shared/infrastructure/repositories/competence-repository.js';
import { V3CertificationScoring } from '../../domain/models/V3CertificationScoring.js';

export const getLatestByDateAndLocale = async ({ locale, date }) => {
  const knexConn = DomainTransaction.getConnection();
  const allAreas = await areaRepository.list();
  // NOTE : only works for certification of core competencies
  const competenceList = await competenceRepository.listPixCompetencesOnly({ locale });

  const competenceScoringConfiguration = await knexConn('competence-scoring-configurations')
    .select('configuration')
    .where('createdAt', '<=', date)
    .orderBy('createdAt', 'desc')
    .first();

  if (!competenceScoringConfiguration) {
    throw new NotFoundError(`No competence scoring configuration found for date ${date.toISOString()}`);
  }

  const certificationScoringConfiguration = await knexConn('certification-scoring-configurations')
    .select('configuration')
    .where('createdAt', '<=', date)
    .orderBy('createdAt', 'desc')
    .first();

  if (!certificationScoringConfiguration) {
    throw new NotFoundError(`No certification scoring configuration found for date ${date.toISOString()}`);
  }

  return V3CertificationScoring.fromConfigurations({
    competenceForScoringConfiguration: competenceScoringConfiguration.configuration,
    certificationScoringConfiguration: certificationScoringConfiguration.configuration,
    allAreas,
    competenceList,
  });
};

export const saveCompetenceForScoringConfiguration = async ({ configuration }) => {
  const knexConn = DomainTransaction.getConnection();
  return knexConn('certification-configurations')
    .where({
      expirationDate: null,
    })
    .update({
      competencesScoringConfiguration: JSON.stringify(configuration),
    });
};

export const saveCertificationScoringConfiguration = async ({ configuration }) => {
  const knexConn = DomainTransaction.getConnection();

  return knexConn('certification-configurations')
    .where({
      expirationDate: null,
    })
    .update({
      globalScoringConfiguration: JSON.stringify(configuration),
    });
};
