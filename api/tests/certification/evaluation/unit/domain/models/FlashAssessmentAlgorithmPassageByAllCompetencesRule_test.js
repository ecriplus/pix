import { FlashAssessmentAlgorithmPassageByAllCompetencesRule } from '../../../../../../src/certification/evaluation/domain/models/FlashAssessmentAlgorithmPassageByAllCompetencesRule.js';
import { domainBuilder, expect } from '../../../../../test-helper.js';

describe('Unit | Domain | Models | FlashAssessmentAlgorithm | FlashAssessmentAlgorithmPassageByAllCompetencesRule', function () {
  describe('#isApplicable', function () {
    describe('when enablePassageByAllCompetences is false', function () {
      it('should return false', function () {
        const configuration = {
          enablePassageByAllCompetences: false,
          answers: [],
        };

        expect(FlashAssessmentAlgorithmPassageByAllCompetencesRule.isApplicable(configuration)).to.be.false;
      });
    });

    describe('when enablePassageByAllCompetences is true', function () {
      it('should return true', function () {
        const configuration = {
          enablePassageByAllCompetences: true,
        };

        expect(FlashAssessmentAlgorithmPassageByAllCompetencesRule.isApplicable(configuration)).to.be.true;
      });
    });
  });

  describe('#execute', function () {
    it('should return the challenges with non answered competences', function () {
      const unansweredCompetenceUnansweredChallenge = domainBuilder.buildChallenge({
        id: 'challenge1',
        competenceId: 'competenceId1',
      });

      const answeredCompetenceUnansweredChallenge = domainBuilder.buildChallenge({
        id: 'challenge2',
        competenceId: 'competenceId2',
      });

      const answeredCompetenceAnsweredChallenge = domainBuilder.buildChallenge({
        id: 'challenge3',
        competenceId: 'competenceId2',
      });

      const allChallenges = [
        unansweredCompetenceUnansweredChallenge,
        answeredCompetenceUnansweredChallenge,
        answeredCompetenceAnsweredChallenge,
      ];

      const assessmentAnswers = [
        domainBuilder.buildAnswer({
          challengeId: answeredCompetenceAnsweredChallenge.id,
        }),
      ];

      expect(
        FlashAssessmentAlgorithmPassageByAllCompetencesRule.execute({
          allChallenges,
          assessmentAnswers,
          availableChallenges: allChallenges,
        }),
      ).to.deep.equal([unansweredCompetenceUnansweredChallenge]);
    });
  });
});
