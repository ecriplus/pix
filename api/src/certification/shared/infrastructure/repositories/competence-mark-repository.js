import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { CompetenceMark } from '../../domain/models/CompetenceMark.js';

const save = async function (competenceMark) {
  await competenceMark.validate();
  const knexConn = DomainTransaction.getConnection();
  const [savedCompetenceMark] = await knexConn('competence-marks')
    .insert(competenceMark)
    .onConflict('id')
    .merge()
    .returning('*');

  return new CompetenceMark(savedCompetenceMark);
};

/**
 * @param {object} params
 * @param {CompetenceMark[]} params.competenceMarks
 * @returns {Promise<CompetenceMark[]>}
 */
const saveMany = async function ({ competenceMarks }) {
  await Promise.all(competenceMarks.map((competenceMark) => competenceMark.validate()));

  const knexConn = DomainTransaction.getConnection();
  const savedCompetenceMarks = await knexConn('competence-marks').insert(competenceMarks).returning('*');

  return savedCompetenceMarks.map((competenceMark) => new CompetenceMark(competenceMark));
};

export { save, saveMany };
