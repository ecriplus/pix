const { expect, sinon, domainBuilder } = require('../../../test-helper');
const cleaCertificationResultRepository = require('../../../../lib/infrastructure/repositories/clea-certification-result-repository');
const pixPlusMaitreCertificationResultRepository = require('../../../../lib/infrastructure/repositories/pix-plus-droit-maitre-certification-result-repository');
const pixPlusExpertCertificationResultRepository = require('../../../../lib/infrastructure/repositories/pix-plus-droit-expert-certification-result-repository');
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');
const assessmentResultRepository = require('../../../../lib/infrastructure/repositories/assessment-result-repository');
const getSessionResults = require('../../../../lib/domain/usecases/get-session-results');

describe('Unit | Domain | Use Cases | get-session-results', function() {

  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const sessionWith2Candidates = domainBuilder.buildSession({ date: '2020/01/01', time: '12:00' });
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const sessionId = sessionWith2Candidates.id;
  const certificationCourseRepository = {};
  const sessionRepositoryStub = {};
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const certifCourse1 = domainBuilder.buildCertificationCourse({ id: 1 });
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const certifCourse2 = domainBuilder.buildCertificationCourse({ id: 2 });
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const certifCourse3 = domainBuilder.buildCertificationCourse({ id: 3 });

  const cleaCertificationResults = [
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    domainBuilder.buildCleaCertificationResult.acquired(),
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    domainBuilder.buildCleaCertificationResult.rejected(),
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    domainBuilder.buildCleaCertificationResult.notTaken(),
  ];
  const pixPlusDroitMaitreCertificationResults = [
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    domainBuilder.buildPixPlusDroitCertificationResult.maitre.acquired(),
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    domainBuilder.buildPixPlusDroitCertificationResult.maitre.rejected(),
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    domainBuilder.buildPixPlusDroitCertificationResult.maitre.notTaken(),
  ];
  const pixPlusDroitExpertCertificationResults = [
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    domainBuilder.buildPixPlusDroitCertificationResult.expert.acquired(),
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    domainBuilder.buildPixPlusDroitCertificationResult.expert.rejected(),
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    domainBuilder.buildPixPlusDroitCertificationResult.expert.notTaken(),
  ];
  const assessmentsIds = [ 1, 2, 3 ];

  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const assessmentResult1 = domainBuilder.buildAssessmentResult({ pixScore: 500, competenceMarks: [], createdAt: 'lundi', assessmentId: assessmentsIds[0] });
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const assessmentResult2 = domainBuilder.buildAssessmentResult({ pixScore: 10, competenceMarks: [], createdAt: 'mardi', assessmentId: assessmentsIds[1], commentForCandidate: 'Son ordinateur a explosé' });
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const assessmentResult3 = domainBuilder.buildAssessmentResult({ pixScore: 400, competenceMarks: [], createdAt: 'mercredi', assessmentId: assessmentsIds[2] });

  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const firstCertifResult = _buildCertificationResult(certifCourse1, assessmentResult1, cleaCertificationResults[0], pixPlusDroitMaitreCertificationResults[0], pixPlusDroitExpertCertificationResults[0]);
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const secondCertifResult = _buildCertificationResult(certifCourse2, assessmentResult2, cleaCertificationResults[1], pixPlusDroitMaitreCertificationResults[1], pixPlusDroitExpertCertificationResults[1]);
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const thirdCertifResult = _buildCertificationResult(certifCourse3, assessmentResult3, cleaCertificationResults[2], pixPlusDroitMaitreCertificationResults[2], pixPlusDroitExpertCertificationResults[2]);

  beforeEach(function() {
    // given
    sessionRepositoryStub.get = sinon.stub().withArgs(sessionId).resolves(sessionWith2Candidates);

    certificationCourseRepository.findCertificationCoursesBySessionId = sinon.stub().withArgs({ sessionId }).resolves([certifCourse1, certifCourse2, certifCourse3]);

    const cleaCertificationResultRepositoryStub = sinon.stub(cleaCertificationResultRepository, 'get');
    cleaCertificationResultRepositoryStub.withArgs({ certificationCourseId: certifCourse1.getId() }).resolves(cleaCertificationResults[0]);
    cleaCertificationResultRepositoryStub.withArgs({ certificationCourseId: certifCourse2.getId() }).resolves(cleaCertificationResults[1]);
    cleaCertificationResultRepositoryStub.withArgs({ certificationCourseId: certifCourse3.getId() }).resolves(cleaCertificationResults[2]);

    const pixPlusMaitreCertificationResultRepositoryStub = sinon.stub(pixPlusMaitreCertificationResultRepository, 'get');
    pixPlusMaitreCertificationResultRepositoryStub.withArgs({ certificationCourseId: certifCourse1.getId() }).resolves(pixPlusDroitMaitreCertificationResults[0]);
    pixPlusMaitreCertificationResultRepositoryStub.withArgs({ certificationCourseId: certifCourse2.getId() }).resolves(pixPlusDroitMaitreCertificationResults[1]);
    pixPlusMaitreCertificationResultRepositoryStub.withArgs({ certificationCourseId: certifCourse3.getId() }).resolves(pixPlusDroitMaitreCertificationResults[2]);

    const pixPlusExpertCertificationResultRepositoryStub = sinon.stub(pixPlusExpertCertificationResultRepository, 'get');
    pixPlusExpertCertificationResultRepositoryStub.withArgs({ certificationCourseId: certifCourse1.getId() }).resolves(pixPlusDroitExpertCertificationResults[0]);
    pixPlusExpertCertificationResultRepositoryStub.withArgs({ certificationCourseId: certifCourse2.getId() }).resolves(pixPlusDroitExpertCertificationResults[1]);
    pixPlusExpertCertificationResultRepositoryStub.withArgs({ certificationCourseId: certifCourse3.getId() }).resolves(pixPlusDroitExpertCertificationResults[2]);

    const assessmentRepositoryStub = sinon.stub(assessmentRepository, 'getIdByCertificationCourseId');
    assessmentRepositoryStub.withArgs(certifCourse1.getId()).resolves(assessmentsIds[0]);
    assessmentRepositoryStub.withArgs(certifCourse2.getId()).resolves(assessmentsIds[1]);
    assessmentRepositoryStub.withArgs(certifCourse3.getId()).resolves(assessmentsIds[2]);

    const assessmentResultRepositoryStub = sinon.stub(assessmentResultRepository, 'findLatestByCertificationCourseIdWithCompetenceMarks');
    assessmentResultRepositoryStub.withArgs({ certificationCourseId: certifCourse1.getId() }).resolves(assessmentResult1);
    assessmentResultRepositoryStub.withArgs({ certificationCourseId: certifCourse2.getId() }).resolves(assessmentResult2);
    assessmentResultRepositoryStub.withArgs({ certificationCourseId: certifCourse3.getId() }).resolves(assessmentResult3);
  });

  it('should return all certification results', async function() {
    // when
    const { certificationResults } = await getSessionResults({
      sessionId,
      sessionRepository: sessionRepositoryStub,
      certificationCourseRepository,
    });

    // then
    const expectedCertifResults = [ firstCertifResult, secondCertifResult, thirdCertifResult ];
    expect(certificationResults).to.deep.equal(expectedCertifResults);
  });

  it('should return the session', async function() {
    // when
    const { session } = await getSessionResults({
      sessionId,
      sessionRepository: sessionRepositoryStub,
      certificationCourseRepository,
    });

    // then
    const expectedSession = sessionWith2Candidates;
    expect(session).to.deep.equal(expectedSession);
  });

  it('should return the fileName', async function() {
    // when
    const { fileName } = await getSessionResults({
      sessionId,
      sessionRepository: sessionRepositoryStub,
      certificationCourseRepository,
    });

    // then
    const expectedFileName = `20200101_1200_resultats_session_${sessionId}.csv`;
    expect(fileName).to.deep.equal(expectedFileName);
  });

});

function _buildCertificationResult(certifCourse, lastAssessmentResult, cleaCertificationResult, pixPlusDroitMaitreCertificationResult, pixPlusDroitExpertCertificationResult) {
  return domainBuilder.buildCertificationResult({
    ...certifCourse.toDTO(),
    lastAssessmentResult,
    assessmentId: lastAssessmentResult.assessmentId,
    cleaCertificationResult,
    pixPlusDroitMaitreCertificationResult,
    pixPlusDroitExpertCertificationResult,
    competencesWithMark: [],
  });
}
