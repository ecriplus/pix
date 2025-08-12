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

  const configuration = await knexConn('certification-configurations')
    .select('id', 'globalScoringConfiguration', 'competencesScoringConfiguration')
    .where('startingDate', '<=', date)
    .andWhere((queryBuilder) => {
      queryBuilder.whereNull('expirationDate').orWhere('expirationDate', '>', date);
    })
    .orderBy('startingDate', 'asc')
    .first();

  if (!configuration || !configuration.competencesScoringConfiguration || !configuration.globalScoringConfiguration) {
    throw new NotFoundError(`No certification scoring configuration found for date ${date.toISOString()}`);
  }

  return V3CertificationScoring.fromConfigurations({
    competenceForScoringConfiguration: configuration.competencesScoringConfiguration,
    certificationScoringConfiguration: configuration.globalScoringConfiguration,
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
