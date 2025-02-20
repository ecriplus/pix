import { EmptyAnswerError } from '../../../../../src/evaluation/domain/errors.js';
import * as correctionService from '../../../../../src/evaluation/domain/services/correction-service.js';
import { saveAndCorrectAnswerForDemoAndPreview } from '../../../../../src/evaluation/domain/usecases/save-and-correct-answer-for-demo-and-preview.js';
import { ChallengeNotAskedError } from '../../../../../src/shared/domain/errors.js';
import { AnswerStatus, Assessment, KnowledgeElement } from '../../../../../src/shared/domain/models/index.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Unit | Evaluation | Domain | Use Cases | save-and-correct-answer-for-demo-and-preview', function () {
  let assessment;
  let challenge;
  let solution;
  let validator;
  let correctAnswerValue;
  let answer;
  let clock;
  let answerRepository, challengeRepository;

  const nowDate = new Date('2021-03-11T11:00:04Z');
  const locale = 'fr';
  const forceOKAnswer = false;

  let dependencies;

  beforeEach(function () {
    nowDate.setMilliseconds(1);
    clock = sinon.useFakeTimers({ now: nowDate, toFake: ['Date'] });
    sinon.stub(KnowledgeElement, 'createKnowledgeElementsForAnswer');
    answerRepository = { saveWithKnowledgeElements: sinon.stub() };
    challengeRepository = { get: sinon.stub() };

    const challengeId = 'oneChallengeId';
    assessment = domainBuilder.buildAssessment({
      lastQuestionDate: nowDate,
      type: Assessment.types.DEMO,
    });
    answer = domainBuilder.buildAnswer({ assessmentId: assessment.id, value: correctAnswerValue, challengeId });
    answer.id = undefined;
    answer.result = undefined;
    answer.resultDetails = undefined;
    correctAnswerValue = '1';
    solution = domainBuilder.buildSolution({ id: answer.challengeId, value: correctAnswerValue });
    validator = domainBuilder.buildValidator.ofTypeQCU({ solution });
    challenge = domainBuilder.buildChallenge({ id: answer.challengeId, validator });
    challengeRepository.get.resolves(challenge);

    dependencies = {
      forceOKAnswer,
      answerRepository,
      challengeRepository,
      correctionService,
    };
  });

  afterEach(async function () {
    clock.restore();
  });

  context('when an answer for that challenge is not for an asked challenge', function () {
    it('should fail because Challenge Not Asked', async function () {
      // given
      assessment.lastChallengeId = 'anotherChallenge';

      // when
      const error = await catchErr(saveAndCorrectAnswerForDemoAndPreview)({
        answer,
        assessment,
        locale,
        ...dependencies,
      });

      // then
      expect(error).to.be.an.instanceOf(ChallengeNotAskedError);
    });
  });

  context('when no answer already exists', function () {
    let completedAnswer;
    let savedAnswer;

    beforeEach(function () {
      completedAnswer = domainBuilder.buildAnswer(answer);
      completedAnswer.id = undefined;
      completedAnswer.result = AnswerStatus.OK;
      completedAnswer.resultDetails = null;
      completedAnswer.timeSpent = 0;
      savedAnswer = domainBuilder.buildAnswer(completedAnswer);
      answerRepository.saveWithKnowledgeElements.resolves(savedAnswer);
      assessment.competenceId = 'recABCD';
    });

    it('should call the answer repository to save the answer', async function () {
      // when
      await saveAndCorrectAnswerForDemoAndPreview({
        answer,
        assessment,
        locale,
        ...dependencies,
      });

      // then
      expect(answerRepository.saveWithKnowledgeElements).to.have.been.calledWithExactly(completedAnswer, []);
    });

    it('should return the saved answer - with the id', async function () {
      // when
      const result = await saveAndCorrectAnswerForDemoAndPreview({
        answer,
        assessment,
        locale,
        ...dependencies,
      });

      // then
      const expectedArgument = savedAnswer;
      expect(result).to.deep.equal(expectedArgument);
    });

    context('when the user responds correctly', function () {
      it('should return an empty levelup', async function () {
        // when
        const result = await saveAndCorrectAnswerForDemoAndPreview({
          answer,
          assessment,
          locale,
          ...dependencies,
        });

        // then
        expect(result.levelup).to.deep.equal({});
      });
    });
  });

  context('compute the timeSpent and save it on the answer', function () {
    let answer;
    let answerSaved;

    it('compute the timeSpent', async function () {
      answer = domainBuilder.buildAnswer({ timeSpent: null });
      assessment = domainBuilder.buildAssessment({
        lastQuestionDate: new Date('2021-03-11T11:00:00Z'),
        type: Assessment.types.DEMO,
      });
      answerSaved = domainBuilder.buildAnswer(answer);
      answerSaved.timeSpent = 5;
      answerRepository.saveWithKnowledgeElements.resolves(answerSaved);

      await saveAndCorrectAnswerForDemoAndPreview({
        answer,
        assessment,
        locale,
        ...dependencies,
      });

      const expectedAnswer = domainBuilder.buildAnswer(answer);
      expectedAnswer.timeSpent = 5;
      expect(answerRepository.saveWithKnowledgeElements).to.be.calledWith(expectedAnswer);
    });
  });

  context('when the challenge is not focused', function () {
    let focusedOutAnswer;
    let answerSaved;

    beforeEach(function () {
      // Given
      focusedOutAnswer = domainBuilder.buildAnswer({ isFocusedOut: true });
      const nonFocusedChallenge = domainBuilder.buildChallenge({
        id: focusedOutAnswer.challengeId,
        validator,
        focused: false,
      });
      challengeRepository.get.resolves(nonFocusedChallenge);
      assessment = domainBuilder.buildAssessment({
        lastQuestionDate: new Date('2021-03-11T11:00:00Z'),
        type: Assessment.types.CERTIFICATION,
      });
      answerSaved = domainBuilder.buildAnswer(focusedOutAnswer);
      answerRepository.saveWithKnowledgeElements.resolves(answerSaved);
    });

    it('should not return focused out answer', async function () {
      // When
      const { result } = await saveAndCorrectAnswerForDemoAndPreview({
        answer: focusedOutAnswer,
        assessment,
        locale,
        ...dependencies,
      });

      // Then
      expect(result).not.to.equal(AnswerStatus.FOCUSEDOUT);
      expect(result).to.deep.equal(AnswerStatus.OK);
    });
  });

  context('when a challenge has an empty answer and no timeout', function () {
    it('should throw an error', async function () {
      // Given
      const emptyAnswer = domainBuilder.buildAnswer({ value: '' });
      const challenge = domainBuilder.buildChallenge({
        id: emptyAnswer.challengeId,
        validator,
      });
      challengeRepository.get.resolves(challenge);
      assessment = domainBuilder.buildAssessment({
        lastQuestionDate: new Date('2021-03-11T11:00:00Z'),
        type: Assessment.types.DEMO,
      });

      // when
      const error = await catchErr(saveAndCorrectAnswerForDemoAndPreview)({
        answer: emptyAnswer,
        locale,
        assessment,
        ...dependencies,
      });

      // then
      expect(error).to.be.an.instanceOf(EmptyAnswerError);
      expect(error.message).to.equal('The answer value cannot be empty');
    });
  });

  context('when a challenge has an empty answer and is timed out', function () {
    it('should not throw an error', async function () {
      // Given
      const emptyAnswer = domainBuilder.buildAnswer({ value: '', timeout: -1 });
      const challenge = domainBuilder.buildChallenge({
        id: emptyAnswer.challengeId,
        validator,
      });
      challengeRepository.get.resolves(challenge);
      assessment = domainBuilder.buildAssessment({
        lastQuestionDate: new Date('2021-03-11T11:00:00Z'),
        type: Assessment.types.DEMO,
      });
      const answerSaved = domainBuilder.buildAnswer(emptyAnswer);
      answerRepository.saveWithKnowledgeElements.resolves(answerSaved);

      // when
      const { result } = await saveAndCorrectAnswerForDemoAndPreview({
        answer: emptyAnswer,
        assessment,
        locale,
        ...dependencies,
      });

      // then
      expect(result).not.to.equal(AnswerStatus.TIMEDOUT);
    });
  });
});
