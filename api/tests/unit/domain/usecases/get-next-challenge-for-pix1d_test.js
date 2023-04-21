const { expect, sinon, domainBuilder } = require('../../../test-helper');
const getNextChallengeForPix1d = require('../../../../lib/domain/usecases/get-next-challenge-for-pix1d');

describe('Unit | Domain | Use Cases | get-next-challenge-for-pix1d', function () {
  describe('#get-next-challenge-for-pix1d', function () {
    context('should calculate the good activityChallengeIndex', function () {
      context('when there is no answer for the given assessmentId', function () {
        it('should call the challengePix1dRepository with an activityChallengeIndex equals to 1 ', async function () {
          const missionId = 'AZERTYUIO';
          const assessmentId = 'id_assessment';
          const DIDACTICIEL = 'didacticiel';
          const answers = [];

          const assessmentRepository = { get: sinon.stub() };
          const answerRepository = { findByAssessment: sinon.stub() };
          const challengePix1dRepository = { get: sinon.stub() };

          assessmentRepository.get.withArgs(assessmentId).resolves({ missionId });
          answerRepository.findByAssessment.withArgs(assessmentId).resolves(answers);

          // when
          await getNextChallengeForPix1d({
            assessmentId,
            assessmentRepository,
            challengePix1dRepository,
            answerRepository,
          });

          // then
          expect(challengePix1dRepository.get).to.have.been.calledWith({
            missionId,
            activityLevel: DIDACTICIEL,
            answerLength: 0,
          });
        });
      });
      context('when there is an answer for the given assessmentId', function () {
        it('should call the challengePix1dRepository with an activityChallengeIndex equals to 2 ', async function () {
          const missionId = 'AZERTYUIO';
          const DIDACTICIEL = 'didacticiel';
          const assessmentId = 'id_assessment';
          const answer = domainBuilder.buildAnswer({ assessmentId });

          const assessmentRepository = { get: sinon.stub() };
          const answerRepository = { findByAssessment: sinon.stub() };
          const challengePix1dRepository = { get: sinon.stub() };

          assessmentRepository.get.withArgs(assessmentId).resolves({ missionId });
          answerRepository.findByAssessment.withArgs(assessmentId).resolves([answer]);

          // when
          await getNextChallengeForPix1d({
            assessmentId,
            assessmentRepository,
            challengePix1dRepository,
            answerRepository,
          });

          // then
          expect(challengePix1dRepository.get).to.have.been.calledWith({
            missionId,
            activityLevel: DIDACTICIEL,
            answerLength: 1,
          });
        });
      });
    });
  });
});
