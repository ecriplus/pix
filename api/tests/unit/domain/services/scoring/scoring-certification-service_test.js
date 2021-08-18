const { expect, domainBuilder, sinon } = require('../../../../test-helper');
const certificationResultService = require('../../../../../lib/domain/services/scoring/certification-result-service');
const scoringCertificationService = require('../../../../../lib/domain/services/scoring/scoring-certification-service');

describe('Unit | Domain | services | scoring | scoring-certification-service', () => {

  describe('#calculateCertificationAssessmentScore', () => {

    it('should return an CertificationAssessmentScore', async function() {
      // given
      const certificationAssessment = domainBuilder.buildCertificationAssessment();
      const competenceWithMark_1_1 = domainBuilder.buildCompetenceMark({ competence_code: '1.1', level: 0, score: 4, area_code: '1', competenceId: 'recComp1' });
      const competenceWithMark_1_2 = domainBuilder.buildCompetenceMark({ competence_code: '1.2', level: 1, score: 8, area_code: '2', competenceId: 'recComp2' });
      const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
        competenceMarks: [competenceWithMark_1_1, competenceWithMark_1_2],
        percentageCorrectAnswers: 55,
      });
      sinon.stub(certificationResultService, 'computeResult')
        .resolves(certificationAssessmentScore);

      // when
      const assessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({ certificationAssessment });

      // then
      expect(assessmentScore).to.deep.equal(certificationAssessmentScore);
    });
  });
});
