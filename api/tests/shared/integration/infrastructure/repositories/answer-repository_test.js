import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { AnswerStatus } from '../../../../../src/shared/domain/models/AnswerStatus.js';
import * as answerRepository from '../../../../../src/shared/infrastructure/repositories/answer-repository.js';
import { catchErr, databaseBuilder, domainBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Repository | answerRepository', function () {
  describe('#get', function () {
    context('when there are no answers', function () {
      it('should reject an error if nothing is found', async function () {
        // when
        const error = await catchErr(answerRepository.get)(100);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });

    context('when there is an answer', function () {
      it('should retrieve an answer from its id', async function () {
        // given
        const expectedAnswer = domainBuilder.buildAnswer({
          id: 1,
          result: AnswerStatus.OK,
          resultDetails: 'some details',
          timeout: 456,
          value: 'Fruits',
          assessmentId: 2,
          challengeId: 'recChallenge123',
          timeSpent: 20,
        });
        databaseBuilder.factory.buildAssessment({ id: 2 });
        databaseBuilder.factory.buildAnswer({
          ...expectedAnswer,
          result: 'ok',
        });
        await databaseBuilder.commit();

        // when
        const foundAnswer = await answerRepository.get(1);

        // then
        expect(foundAnswer).to.deepEqualInstance(expectedAnswer);
      });
    });
  });

  describe('#findByChallengeAndAssessment', function () {
    it('should returns null if there is no assessment matching', async function () {
      // given
      databaseBuilder.factory.buildAssessment({ id: 123 });
      databaseBuilder.factory.buildAnswer({ assessmentId: 123, challengeId: 'recChal1' });

      // when
      const foundAnswer = await answerRepository.findByChallengeAndAssessment({
        challengeId: 'recChal1',
        assessmentId: 456,
      });

      // then
      expect(foundAnswer).to.be.null;
    });

    it('should returns null if there is no challengeId matching', async function () {
      // given
      databaseBuilder.factory.buildAssessment({ id: 123 });
      databaseBuilder.factory.buildAnswer({ assessmentId: 123, challengeId: 'recChal1' });

      // when
      const foundAnswer = await answerRepository.findByChallengeAndAssessment({
        challengeId: 'recChal2',
        assessmentId: 123,
      });

      // then
      expect(foundAnswer).to.be.null;
    });

    it('should find the answer by challenge and assessment', async function () {
      // given
      const expectedAnswer = domainBuilder.buildAnswer({
        id: 1,
        result: AnswerStatus.OK,
        resultDetails: 'some details',
        timeout: 456,
        value: 'Fruits',
        assessmentId: 123,
        challengeId: 'recChallenge123',
        timeSpent: 20,
      });
      databaseBuilder.factory.buildAssessment({ id: 123 });
      databaseBuilder.factory.buildAnswer({
        ...expectedAnswer,
        result: 'ok',
      });
      await databaseBuilder.commit();

      // when
      const foundAnswer = await answerRepository.findByChallengeAndAssessment({
        challengeId: 'recChallenge123',
        assessmentId: 123,
      });

      // then
      expect(foundAnswer).to.deepEqualInstance(expectedAnswer);
    });

    it('should return the most recent answer when several answers match with challenge and assessment', async function () {
      // given
      const olderAnswer = domainBuilder.buildAnswer({
        id: 1,
        result: AnswerStatus.OK,
        resultDetails: 'some details',
        timeout: 456,
        value: 'Fruits',
        assessmentId: 123,
        challengeId: 'recChallenge123',
        timeSpent: 20,
      });
      const newerAnswer = domainBuilder.buildAnswer({
        id: 2,
        result: AnswerStatus.KO,
        resultDetails: 'some other details',
        timeout: null,
        value: 'Légumes',
        assessmentId: 123,
        challengeId: 'recChallenge123',
        timeSpent: 25,
      });
      databaseBuilder.factory.buildAssessment({ id: 123 });
      databaseBuilder.factory.buildAnswer({
        ...olderAnswer,
        result: 'ok',
        createdAt: new Date('2020-01-01'),
      });
      databaseBuilder.factory.buildAnswer({
        ...newerAnswer,
        result: 'ko',
        createdAt: new Date('2021-01-01'),
      });
      await databaseBuilder.commit();

      // when
      const foundAnswer = await answerRepository.findByChallengeAndAssessment({
        challengeId: 'recChallenge123',
        assessmentId: 123,
      });

      // then
      expect(foundAnswer).to.deepEqualInstance(newerAnswer);
    });
  });

  describe('#findByAssessment', function () {
    context('when assessment does not exist', function () {
      it('should return an empty array', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAnswer({ assessmentId: 123 });
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByAssessment(456);

        // then
        expect(foundAnswers).to.be.empty;
      });
    });

    context('when assessment does not have any answers', function () {
      it('should return an empty array', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAssessment({ id: 456 });
        databaseBuilder.factory.buildAnswer({ assessmentId: 456 });
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByAssessment(123);

        // then
        expect(foundAnswers).to.be.empty;
      });
    });

    context('when assessment has some answers', function () {
      it('should return the answers ordered by creation date', async function () {
        // given
        const firstAnswer = domainBuilder.buildAnswer({
          id: 1,
          result: AnswerStatus.OK,
          resultDetails: 'some details',
          timeout: 456,
          value: 'Fruits',
          assessmentId: 123,
          challengeId: 'recChallenge123',
          timeSpent: 20,
        });
        const secondAnswer = domainBuilder.buildAnswer({
          id: 2,
          result: AnswerStatus.KO,
          resultDetails: 'some details',
          timeout: null,
          value: 'Fruits',
          assessmentId: 123,
          challengeId: 'recChallenge456',
          timeSpent: 20,
        });
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAnswer({ ...secondAnswer, result: 'ko', createdAt: new Date('2020-01-01') });
        databaseBuilder.factory.buildAnswer({ ...firstAnswer, result: 'ok', createdAt: new Date('2019-01-01') });
        databaseBuilder.factory.buildAnswer();
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByAssessment(123);

        // then
        expect(foundAnswers).to.deepEqualArray([firstAnswer, secondAnswer]);
      });
    });

    context('when assessment has some duplicate answers', function () {
      it('should return only one answer, the older one', async function () {
        // given
        const challengeId = 'recChallenge123';
        const olderAnswer = domainBuilder.buildAnswer({
          id: 1,
          assessmentId: 123,
          result: AnswerStatus.KO,
          challengeId,
        });
        const recentAnswer = domainBuilder.buildAnswer({
          id: 2,
          assessmentId: 123,
          result: AnswerStatus.KO,
          challengeId,
        });
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAnswer({ ...recentAnswer, result: 'ko', createdAt: new Date('2020-01-01') });
        databaseBuilder.factory.buildAnswer({ ...olderAnswer, result: 'ko', createdAt: new Date('2018-01-01') });
        databaseBuilder.factory.buildAnswer();
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByAssessment(123);

        // then
        expect(foundAnswers).to.have.lengthOf(1);
        expect(foundAnswers).to.deepEqualArray([olderAnswer]);
        expect(foundAnswers[0].id).to.equal(olderAnswer.id);
      });
    });
  });

  describe('#findByAssessmentExcludingChallenges', function () {
    context('when assessment does not exist', function () {
      it('should return an empty array', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAnswer({ assessmentId: 123 });
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByAssessmentExcludingChallengeIds({ assessmentId: 456 });

        // then
        expect(foundAnswers).to.be.empty;
      });
    });

    context('when assessment exists', function () {
      context('when excludingChallengeIds is not provided', function () {
        it('should return all answers', async function () {
          // given
          databaseBuilder.factory.buildAssessment({ id: 123 });
          const expectedAnswer = domainBuilder.buildAnswer({ assessmentId: 123 });
          databaseBuilder.factory.buildAnswer({ ...expectedAnswer, result: expectedAnswer.result.status });
          await databaseBuilder.commit();

          // when
          const foundAnswers = await answerRepository.findByAssessmentExcludingChallengeIds({ assessmentId: 123 });

          // then
          expect(foundAnswers).to.deep.equal([expectedAnswer]);
        });
      });

      context('when excludingChallengeIds is provided', function () {
        it('should return answers except the ones excluded', async function () {
          // given
          databaseBuilder.factory.buildAssessment({ id: 123 });
          const expectedAnswer = domainBuilder.buildAnswer({ assessmentId: 123 });
          const excludedAnswer = domainBuilder.buildAnswer({
            id: 456,
            assessmentId: 123,
            challengeId: 'excludedChallengeId',
          });
          databaseBuilder.factory.buildAnswer({ ...expectedAnswer, result: expectedAnswer.result.status });
          databaseBuilder.factory.buildAnswer({ ...excludedAnswer, result: excludedAnswer.result.status });
          await databaseBuilder.commit();

          // when
          const foundAnswers = await answerRepository.findByAssessmentExcludingChallengeIds({
            assessmentId: 123,
            excludedChallengeIds: [excludedAnswer.challengeId],
          });

          // then
          expect(foundAnswers).to.deep.equal([expectedAnswer]);
        });
      });
    });

    context('when there are doubled answers', function () {
      it('should return unique answers', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 123 });
        const firstAnswer = domainBuilder.buildAnswer({ id: 1, assessmentId: 123, challengeId: 'recChallenge123' });
        const secondAnswer = domainBuilder.buildAnswer({ id: 3, assessmentId: 123, challengeId: 'recChallenge456' });
        databaseBuilder.factory.buildAnswer({
          ...firstAnswer,
          id: 1,
          result: firstAnswer.result.status,
        });
        databaseBuilder.factory.buildAnswer({
          ...firstAnswer,
          id: 2,
          result: firstAnswer.result.status,
        });
        databaseBuilder.factory.buildAnswer({
          ...secondAnswer,
          id: 3,
          result: secondAnswer.result.status,
        });
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByAssessmentExcludingChallengeIds({
          assessmentId: 123,
          excludedChallengeIds: [],
        });

        // then
        expect(foundAnswers).to.deep.equal([firstAnswer, secondAnswer]);
      });
    });
  });

  describe('#findChallengeIdsFromAnswerIds', function () {
    context('when provided answerIds collection is empty', function () {
      it('should return an empty array', async function () {
        // when
        const challengeIds = await answerRepository.findChallengeIdsFromAnswerIds([]);

        // then
        expect(challengeIds).to.be.empty;
      });
    });

    context('when provided answerIds refer to non-existent answers', function () {
      it('should return an empty array', async function () {
        // when
        const challengeIds = await answerRepository.findChallengeIdsFromAnswerIds([1]);

        // then
        expect(challengeIds).to.be.empty;
      });
    });

    context('when provided answerIds list contains duplicate ids', function () {
      it('should return distinct challengeIds', async function () {
        // given
        databaseBuilder.factory.buildAnswer({ id: 123, challengeId: 'recABC' });
        await databaseBuilder.commit();

        // when
        const challengeIds = await answerRepository.findChallengeIdsFromAnswerIds([123, 123]);

        // then
        expect(challengeIds).to.deepEqualArray(['recABC']);
      });
    });

    it('should return a list of corresponding distinct challenge ids ordered by challenge id', async function () {
      // given
      databaseBuilder.factory.buildAnswer({ id: 123, challengeId: 'recABC' });
      databaseBuilder.factory.buildAnswer({ id: 456, challengeId: 'recDEF' });
      databaseBuilder.factory.buildAnswer({ id: 789, challengeId: 'recGHI' });
      databaseBuilder.factory.buildAnswer({ id: 159, challengeId: 'recABC' });
      await databaseBuilder.commit();

      // when
      const challengeIds = await answerRepository.findChallengeIdsFromAnswerIds([456, 123, 789, 159]);

      // then
      expect(challengeIds).to.have.same.members(['recABC', 'recDEF', 'recGHI']);
    });
  });

  describe('#save', function () {
    it('should save and return the answer', async function () {
      // given
      const answerToSave = domainBuilder.buildAnswer({
        id: null,
        result: AnswerStatus.OK,
        resultDetails: 'some details',
        timeout: 456,
        value: 'Fruits',
        assessmentId: 123,
        challengeId: 'recChallenge123',
        timeSpent: 20,
        isFocusedOut: true,
      });
      databaseBuilder.factory.buildAssessment({ id: 123 });
      await databaseBuilder.commit();

      // when
      const savedAnswer = await answerRepository.save({ answer: answerToSave });

      // then
      const answerInDB = await answerRepository.get(savedAnswer.id);
      expect(savedAnswer).to.deepEqualInstance(answerInDB);
    });
  });
});
