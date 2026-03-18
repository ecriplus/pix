import { Frameworks } from '../../../../../../src/certification/configuration/domain/models/Frameworks.js';
import {
  CERTIFICATE_STATUSES,
  EXTRA_CERTIFICATE_STATUSES,
} from '../../../../../../src/certification/results/domain/models/CertificateSummary.js';
import * as certificateSummaryRepository from '../../../../../../src/certification/results/infrastructure/repositories/certificate-summary-repository.js';
import { ComplementaryCertificationCourseResult } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationCourseResult.js';
import { AssessmentResult } from '../../../../../../src/shared/domain/models/AssessmentResult.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../../test-helper.js';

describe('Integration | Infrastructure | Repository | Certification summary', function () {
  describe('#findByUserId', function () {
    describe('when the user has no certification taken', function () {
      it('should return an empty array', async function () {
        // given
        const user = databaseBuilder.factory.buildUser({});
        await databaseBuilder.commit();

        // when
        const certificationTaken = await certificateSummaryRepository.findByUserId({ userId: user.id });

        // then
        expect(certificationTaken).to.be.empty;
      });
    });

    describe('when the user has no certification scored', function () {
      it('should return an empty array', async function () {
        // given
        const session = databaseBuilder.factory.buildSession({
          certificationCenter: 'Centre de certif pix',
        });
        const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
          sessionId: session.id,
          framework: Frameworks.CORE,
        });
        await databaseBuilder.commit();

        // when
        const certificationTaken = await certificateSummaryRepository.findByUserId({
          userId: certificationCourse.userId,
        });

        // then
        expect(certificationTaken).to.be.empty;
      });
    });

    describe('when the user has a core certification taken', function () {
      it('should return an array with the certificate summary', async function () {
        // given
        const session = databaseBuilder.factory.buildSession({
          certificationCenter: 'Centre de certif pix',
        });
        const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
          sessionId: session.id,
          framework: Frameworks.CORE,
        });
        const assessmentResult = databaseBuilder.factory.buildAssessmentResult({
          status: AssessmentResult.status.VALIDATED,
          commentForCandidate: 'blabla',
        });
        databaseBuilder.factory.buildCertificationCourseLastAssessmentResult({
          certificationCourseId: certificationCourse.id,
          lastAssessmentResultId: assessmentResult.id,
        });
        await databaseBuilder.commit();

        // when
        const certificationTaken = await certificateSummaryRepository.findByUserId({
          userId: certificationCourse.userId,
        });

        // then
        expect(certificationTaken).to.deepEqualArray([
          domainBuilder.certification.results.buildCertificateSummary({
            id: certificationCourse.id,
            certificationCenterName: session.certificationCenter,
            certificationFramework: certificationCourse.framework,
            certificationStartedAt: certificationCourse.createdAt,
            extraCertificationStatus: EXTRA_CERTIFICATE_STATUSES.NOT_APPLICABLE,
            juryComment: {
              commentByAutoJury: undefined,
              fallbackComment: assessmentResult.commentForCandidate,
            },
            pixScore: assessmentResult.pixScore,
            status: CERTIFICATE_STATUSES.VALIDATED,
            verificationCode: certificationCourse.verificationCode,
          }),
        ]);
      });
    });

    describe('when the user has a double certifications taken', function () {
      describe('when it is a v2 with a complementary', function () {
        it('should return an array with the certificate summary', async function () {
          // given
          const session = databaseBuilder.factory.buildSession({
            certificationCenter: 'Centre de certif pix',
          });

          const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
            sessionId: session.id,
            framework: Frameworks.EDU_1ER_DEGRE,
          });
          const assessmentResult = databaseBuilder.factory.buildAssessmentResult({
            status: AssessmentResult.status.VALIDATED,
          });
          databaseBuilder.factory.buildCertificationCourseLastAssessmentResult({
            certificationCourseId: certificationCourse.id,
            lastAssessmentResultId: assessmentResult.id,
          });

          const complementaryCertificationCourse = databaseBuilder.factory.buildComplementaryCertificationCourse({
            certificationCourseId: certificationCourse.id,
          });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            source: ComplementaryCertificationCourseResult.sources.PIX,
            acquired: true,
            complementaryCertificationCourseId: complementaryCertificationCourse.id,
            complementaryCertificationBadgeId: complementaryCertificationCourse.complementaryCertificationBadgeId,
          });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
            acquired: true,
            complementaryCertificationCourseId: complementaryCertificationCourse.id,
            complementaryCertificationBadgeId: complementaryCertificationCourse.complementaryCertificationBadgeId,
          });

          await databaseBuilder.commit();

          // when
          const certificationTaken = await certificateSummaryRepository.findByUserId({
            userId: certificationCourse.userId,
          });

          // then
          expect(certificationTaken).to.deepEqualArray([
            domainBuilder.certification.results.buildCertificateSummary({
              id: certificationCourse.id,
              certificationCenterName: session.certificationCenter,
              certificationFramework: certificationCourse.framework,
              certificationStartedAt: certificationCourse.createdAt,
              extraCertificationStatus: EXTRA_CERTIFICATE_STATUSES.ACQUIRED,
              juryComment: {
                commentByAutoJury: undefined,
                fallbackComment: assessmentResult.commentForCandidate,
              },
              pixScore: assessmentResult.pixScore,
              status: CERTIFICATE_STATUSES.VALIDATED,
              verificationCode: certificationCourse.verificationCode,
            }),
          ]);
        });
      });

      describe('when it is a Clea double certification', function () {
        it('should return an array with the certificate summary', async function () {
          // given
          const session = databaseBuilder.factory.buildSession({
            certificationCenter: 'Centre de certif pix',
          });

          const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
            sessionId: session.id,
            framework: Frameworks.CLEA,
          });
          const assessmentResult = databaseBuilder.factory.buildAssessmentResult({
            status: AssessmentResult.status.VALIDATED,
          });
          databaseBuilder.factory.buildCertificationCourseLastAssessmentResult({
            certificationCourseId: certificationCourse.id,
            lastAssessmentResultId: assessmentResult.id,
          });

          const complementaryCertificationCourse = databaseBuilder.factory.buildComplementaryCertificationCourse({
            certificationCourseId: certificationCourse.id,
          });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            source: ComplementaryCertificationCourseResult.sources.PIX,
            acquired: true,
            complementaryCertificationCourseId: complementaryCertificationCourse.id,
            complementaryCertificationBadgeId: complementaryCertificationCourse.complementaryCertificationBadgeId,
          });
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
            acquired: false,
            complementaryCertificationCourseId: complementaryCertificationCourse.id,
            complementaryCertificationBadgeId: complementaryCertificationCourse.complementaryCertificationBadgeId,
          });

          await databaseBuilder.commit();

          // when
          const certificationTaken = await certificateSummaryRepository.findByUserId({
            userId: certificationCourse.userId,
          });

          // then
          expect(certificationTaken).to.deepEqualArray([
            domainBuilder.certification.results.buildCertificateSummary({
              id: certificationCourse.id,
              certificationCenterName: session.certificationCenter,
              certificationFramework: certificationCourse.framework,
              certificationStartedAt: certificationCourse.createdAt,
              extraCertificationStatus: EXTRA_CERTIFICATE_STATUSES.NOT_ACQUIRED,
              juryComment: {
                commentByAutoJury: undefined,
                fallbackComment: assessmentResult.commentForCandidate,
              },
              pixScore: assessmentResult.pixScore,
              status: CERTIFICATE_STATUSES.VALIDATED,
              verificationCode: certificationCourse.verificationCode,
            }),
          ]);
        });
      });
    });
  });
});
