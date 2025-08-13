import { FinalizedSession } from '../../../../../../src/certification/session-management/domain/models/FinalizedSession.js';
import { JuryCertificationSummary } from '../../../../../../src/certification/session-management/domain/read-models/JuryCertificationSummary.js';
import { SessionFinalized } from '../../../../../../src/certification/session-management/domain/read-models/SessionFinalized.js';
import { registerPublishableSession } from '../../../../../../src/certification/session-management/domain/usecases/register-publishable-session.js';
import { CertificationIssueReportSubcategories } from '../../../../../../src/certification/shared/domain/models/CertificationIssueReportCategory.js';
import { CertificationIssueReportCategory } from '../../../../../../src/certification/shared/domain/models/CertificationIssueReportCategory.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { status as assessmentResultStatuses } from '../../../../../../src/shared/domain/models/AssessmentResult.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

const juryCertificationSummaryRepository = { findBySessionId: sinon.stub() };
const finalizedSessionRepository = { save: sinon.stub() };
const dependencies = {
  juryCertificationSummaryRepository,
  finalizedSessionRepository,
};

describe('Unit | UseCase |  register-publishable-session', function () {
  it('saves a finalized session', async function () {
    // given
    sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
      return callback();
    });
    const sessionFinalized = new SessionFinalized({
      sessionId: 1234,
      finalizedAt: new Date(),
      hasExaminerGlobalComment: false,
      certificationCenterName: 'A certification center name',
      sessionDate: '2021-01-29',
      sessionTime: '14:00',
    });
    const juryCertificationSummary = new JuryCertificationSummary({
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
      status: assessmentResultStatuses.VALIDATED,
      pixScore: 120,
      createdAt: new Date(),
      completedAt: new Date(),
      isPublished: false,
      cleaCertificationStatus: 'not_passed',
      certificationIssueReports: [
        domainBuilder.buildCertificationIssueReport({
          category: CertificationIssueReportCategory.NON_BLOCKING_TECHNICAL_ISSUE,
          subcategory: CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE,
        }),
      ],
    });
    juryCertificationSummaryRepository.findBySessionId
      .withArgs({ sessionId: 1234 })
      .resolves([juryCertificationSummary]);
    finalizedSessionRepository.save.resolves();
    const finalizedSessionFromSpy = sinon.spy(FinalizedSession, 'from');

    // when
    await registerPublishableSession({ sessionFinalized, ...dependencies });

    // then
    expect(finalizedSessionFromSpy).to.have.been.calledOnceWithExactly({
      sessionId: sessionFinalized.sessionId,
      finalizedAt: sessionFinalized.finalizedAt,
      certificationCenterName: sessionFinalized.certificationCenterName,
      sessionDate: sessionFinalized.sessionDate,
      sessionTime: sessionFinalized.sessionTime,
      hasExaminerGlobalComment: false,
      juryCertificationSummaries: [juryCertificationSummary],
    });
    expect(finalizedSessionRepository.save).to.have.been.calledWithExactly({
      finalizedSession: new FinalizedSession({
        sessionId: sessionFinalized.sessionId,
        finalizedAt: sessionFinalized.finalizedAt,
        certificationCenterName: sessionFinalized.certificationCenterName,
        sessionDate: sessionFinalized.sessionDate,
        sessionTime: sessionFinalized.sessionTime,
        isPublishable: true,
        publishedAt: null,
      }),
    });
  });
});
