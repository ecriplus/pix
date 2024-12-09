import { NotFoundError } from '../../domain/errors.js';
import { Skill } from '../../domain/models/Skill.js';
import { getTranslatedKey } from '../../domain/services/get-translated-text.js';
import { skillDatasource } from '../datasources/learning-content/skill-datasource.js';

function _toDomain(skillData, locale, useFallback) {
  const translatedHint = getTranslatedKey(skillData.hint_i18n, locale, useFallback);
  return new Skill({
    id: skillData.id,
    name: skillData.name,
    pixValue: skillData.pixValue,
    competenceId: skillData.competenceId,
    tutorialIds: skillData.tutorialIds,
    tubeId: skillData.tubeId,
    version: skillData.version,
    difficulty: skillData.level,
    learningMoreTutorialIds: skillData.learningMoreTutorialIds,
    status: skillData.status,
    hintStatus: skillData.hintStatus,
    hint: translatedHint,
  });
}

const get = async function (id, { locale, useFallback } = { locale: null, useFallback: true }) {
  try {
    return _toDomain(await skillDatasource.get(id), locale, useFallback);
  } catch (e) {
    throw new NotFoundError('Erreur, acquis introuvable');
  }
};

const list = async function () {
  const skillDatas = await skillDatasource.list();
  return skillDatas.sort(byId).map(_toDomain);
};

const findActiveByTubeId = async function (tubeId) {
  const skillDatas = await skillDatasource.findActiveByTubeId(tubeId);
  return skillDatas.sort(byId).map(_toDomain);
};

const findOperativeByTubeId = async function (tubeId) {
  const skillDatas = await skillDatasource.findOperativeByTubeId(tubeId);
  return skillDatas.sort(byId).map(_toDomain);
};

const findActiveByCompetenceId = async function (competenceId) {
  const skillDatas = await skillDatasource.findActiveByCompetenceId(competenceId);
  return skillDatas.sort(byId).map(_toDomain);
};

const findOperativeByCompetenceId = async function (competenceId) {
  const skillDatas = await skillDatasource.findOperativeByCompetenceId(competenceId);
  return skillDatas.sort(byId).map(_toDomain);
};

const findOperativeByCompetenceIds = async function (competenceIds) {
  const skillDatas = await skillDatasource.findOperativeByCompetenceIds(competenceIds);
  return skillDatas.sort(byId).map(_toDomain);
};

const findOperativeByIds = async function (skillIds) {
  const skillDatas = await skillDatasource.findOperativeByRecordIds(skillIds);
  return skillDatas.sort(byId).map(_toDomain);
};

const findByRecordIds = async function (skillIds) {
  const skillDatas = await skillDatasource.findByRecordIds(skillIds);
  return skillDatas.sort(byId).map(_toDomain);
};

const findActiveByRecordIds = async function (skillIds) {
  const skillDatas = await skillDatasource.findActiveByRecordIds(skillIds);
  return skillDatas.sort(byId).map(_toDomain);
};

function byId(entityA, entityB) {
  return entityA.id < entityB.id ? -1 : 1;
}

export {
  findActiveByCompetenceId,
  findActiveByRecordIds,
  findActiveByTubeId,
  findByRecordIds,
  findOperativeByCompetenceId,
  findOperativeByCompetenceIds,
  findOperativeByIds,
  findOperativeByTubeId,
  get,
  list,
};
