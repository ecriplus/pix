// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jsYaml'.
const jsYaml = require('js-yaml');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeA... Remove this comment to see the full error message
const { ChallengeAlreadyAnsweredError, NotFoundError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Answer'.
const Answer = require('../../domain/models/Answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'answerStat... Remove this comment to see the full error message
const answerStatusDatabaseAdapter = require('../adapters/answer-status-database-adapter');

function _adaptAnswerToDb(answer: $TSFixMe) {
  return {
    ..._.pick(answer, ['value', 'timeout', 'challengeId', 'assessmentId', 'timeSpent', 'isFocusedOut']),
    result: answerStatusDatabaseAdapter.toSQLString(answer.result),
    resultDetails: jsYaml.dump(answer.resultDetails),
  };
}

function _adaptKnowledgeElementToDb(knowledgeElement: $TSFixMe) {
  return _.pick(knowledgeElement, [
    'source',
    'status',
    'earnedPix',
    'answerId',
    'assessmentId',
    'skillId',
    'userId',
    'competenceId',
  ]);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(answerDTO: $TSFixMe) {
  return new Answer({
    ...answerDTO,
    result: answerStatusDatabaseAdapter.fromSQLString(answerDTO.result),
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomainA... Remove this comment to see the full error message
function _toDomainArray(answerDTOs: $TSFixMe) {
  return _.map(answerDTOs, _toDomain);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMNS'.
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

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe) {
    const answerDTO = await knex.select(COLUMNS).from('answers').where({ id }).first();

    if (!answerDTO) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Not found answer for ID ${id}`);
    }

    return _toDomain(answerDTO);
  },

  async findByIds(ids: $TSFixMe) {
    const answerDTOs = await knex.select(COLUMNS).from('answers').whereInArray('id', ids).orderBy('id');

    return _toDomainArray(answerDTOs);
  },

  async findByChallengeAndAssessment({
    challengeId,
    assessmentId
  }: $TSFixMe) {
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
  },

  async findByAssessment(assessmentId: $TSFixMe) {
    const answerDTOs = await knex.select(COLUMNS).from('answers').where({ assessmentId }).orderBy('createdAt');
    const answerDTOsWithoutDuplicate = _.uniqBy(answerDTOs, 'challengeId');

    return _toDomainArray(answerDTOsWithoutDuplicate);
  },

  async findLastByAssessment(assessmentId: $TSFixMe) {
    const answerDTO = await knex
      .select(COLUMNS)
      .from('answers')
      .where({ assessmentId })
      .orderBy('createdAt', 'desc')
      .first();

    if (!answerDTO) {
      return null;
    }

    return _toDomain(answerDTO);
  },

  async findChallengeIdsFromAnswerIds(ids: $TSFixMe) {
    return knex.distinct().pluck('challengeId').from('answers').whereInArray('id', ids);
  },

  async saveWithKnowledgeElements(answer: $TSFixMe, knowledgeElements: $TSFixMe) {
    const answerForDB = _adaptAnswerToDb(answer);
    return knex.transaction(async (trx: $TSFixMe) => {
      const alreadySavedAnswer = await trx('answers')
        .select('id')
        .where({ challengeId: answer.challengeId, assessmentId: answer.assessmentId });
      if (alreadySavedAnswer.length !== 0) {
        throw new ChallengeAlreadyAnsweredError();
      }
      const [savedAnswerDTO] = await trx('answers').insert(answerForDB).returning(COLUMNS);
      const savedAnswer = _toDomain(savedAnswerDTO);
      if (!_.isEmpty(knowledgeElements)) {
        for (const knowledgeElement of knowledgeElements) {
          knowledgeElement.answerId = savedAnswer.id;
        }
        const knowledgeElementsForDB = knowledgeElements.map(_adaptKnowledgeElementToDb);
        await trx('knowledge-elements').insert(knowledgeElementsForDB);
      }
      return savedAnswer;
    });
  },
};
