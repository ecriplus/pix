import jsYaml from 'js-yaml';
import _ from 'lodash';

import { knex } from '../../../../db/knex-database-connection.js';
import { Answer } from '../../../evaluation/domain/models/Answer.js';
import { DomainTransaction } from '../../domain/DomainTransaction.js';
import { ChallengeAlreadyAnsweredError, NotFoundError } from '../../domain/errors.js';
import * as answerStatusDatabaseAdapter from '../adapters/answer-status-database-adapter.js';

function _adaptAnswerToDb(answer) {
  return {
    ..._.pick(answer, ['value', 'timeout', 'challengeId', 'assessmentId', 'timeSpent', 'isFocusedOut']),
    result: answerStatusDatabaseAdapter.toSQLString(answer.result),
    resultDetails: jsYaml.dump(answer.resultDetails),
  };
}

function _toDomain(answerDTO) {
  return new Answer({
    ...answerDTO,
    result: answerStatusDatabaseAdapter.fromSQLString(answerDTO.result),
  });
}

function _toDomainArray(answerDTOs) {
  return _.map(answerDTOs, _toDomain);
}

const COLUMNS = Object.freeze([
  'id',
  'result',
  'resultDetails',
  'timeout',
  'value',
  'assessmentId',
  'challengeId',
  'timeSpent',
]);

const get = async function (id) {
  const answerDTO = await knex.select(COLUMNS).from('answers').where({ id }).first();

  if (!answerDTO) {
    throw new NotFoundError(`Not found answer for ID ${id}`);
  }

  return _toDomain(answerDTO);
};

const findByChallengeAndAssessment = async function ({ challengeId, assessmentId }) {
  const answerDTO = await knex
    .select(COLUMNS)
    .from('answers')
    .where({ challengeId, assessmentId })
    .orderBy('createdAt', 'desc')
    .first();

  if (!answerDTO) {
    return null;
  }

  return _toDomain(answerDTO);
};

const findByAssessment = async function (assessmentId) {
  const answerDTOs = await knex.select(COLUMNS).from('answers').where({ assessmentId }).orderBy('createdAt');
  const answerDTOsWithoutDuplicate = _.uniqBy(answerDTOs, 'challengeId');

  return _toDomainArray(answerDTOsWithoutDuplicate);
};

const findByAssessmentExcludingChallengeIds = async function ({ assessmentId, excludedChallengeIds = [] }) {
  const answerDTOs = await knex
    .with('all-first-answers', (qb) => {
      qb.select('*')
        .distinctOn('challengeId', 'assessmentId')
        .from('answers')
        .where({ assessmentId })
        .whereNotIn('challengeId', excludedChallengeIds)
        .orderBy(['challengeId', 'assessmentId', 'createdAt']);
    })
    .from('all-first-answers')
    .orderBy('all-first-answers.createdAt');

  return _toDomainArray(answerDTOs);
};

const findChallengeIdsFromAnswerIds = async function (ids) {
  return knex.distinct().pluck('challengeId').from('answers').whereInArray('id', ids);
};

const save = async function ({ answer }) {
  const knexConn = DomainTransaction.getConnection();
  const answerForDB = _adaptAnswerToDb(answer);
  const alreadySavedAnswer = await knexConn('answers')
    .select('id')
    .where({ challengeId: answer.challengeId, assessmentId: answer.assessmentId });
  if (alreadySavedAnswer.length !== 0) {
    throw new ChallengeAlreadyAnsweredError();
  }
  const [savedAnswerDTO] = await knexConn('answers').insert(answerForDB).returning(COLUMNS);
  return _toDomain(savedAnswerDTO);
};

export {
  findByAssessment,
  findByAssessmentExcludingChallengeIds,
  findByChallengeAndAssessment,
  findChallengeIdsFromAnswerIds,
  get,
  save,
};
