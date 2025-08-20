import lodash from 'lodash';

import {
  CORE_CERTIFICATION,
  JuryCertificationSummary,
} from '../../../../../../src/certification/session-management/domain/read-models/JuryCertificationSummary.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { AssessmentResult } from '../../../../../../src/shared/domain/models/AssessmentResult.js';
import { getI18n } from '../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { domainBuilder, expect } from '../../../../../test-helper.js';
const { forIn } = lodash;

describe('Unit | Domain | Models | JuryCertificationSummary', function () {
  describe('#constructor', function () {
    it('should return a JuryCertificationSummary', function () {
      // given
      const notImpactfulIssueReport = domainBuilder.buildCertificationIssueReport.notImpactful({ resolvedAt: null });
      const data = {
        certificationIssueReports: [notImpactfulIssueReport],
        certificationObtained: 'Pix+ Droit Expert',
        completedAt: new Date('2020-01-01'),
        createdAt: new Date('2020-01-02'),
        firstName: 'Mad',
        lastName: 'Martigan',
        id: 100001,
        isFlaggedAborted: false,
        isPublished: false,
        pixScore: 751,
        status: 'started',
      };

      // when
      const juryCertificationSummary = new JuryCertificationSummary(data);

      // then
      expect(juryCertificationSummary).to.deep.equal({
        certificationIssueReports: [notImpactfulIssueReport],
        certificationObtained: CORE_CERTIFICATION,
        completedAt: new Date('2020-01-01'),
        createdAt: new Date('2020-01-02'),
        firstName: 'Mad',
        lastName: 'Martigan',
        id: 100001,
        isFlaggedAborted: false,
        isPublished: false,
        pixScore: 751,
        status: 'started',
      });
    });
  });

  describe('#validate', function () {
    context('when a status is given', function () {
      forIn(AssessmentResult.status, (status, key) => {
        it(`should returns "${status}" status`, function () {
          // when
          const juryCertificationSummary = new JuryCertificationSummary({ status });

          // then
          expect(juryCertificationSummary.status).equal(JuryCertificationSummary.statuses[key]);
        });
      });
    });

    context('when assessment is ended by supervisor', function () {
      it(`should returns "endedBySupervisor" status`, function () {
        // when
        const juryCertificationSummary = new JuryCertificationSummary({ isEndedBySupervisor: true });

        // then
        expect(juryCertificationSummary.status).equal(JuryCertificationSummary.statuses['ENDED_BY_SUPERVISOR']);
      });
    });

    context('when no status is given', function () {
      it('should return "started"', function () {
        // when
        const juryCertificationSummary = new JuryCertificationSummary({ status: null });

        // then
        expect(juryCertificationSummary.status).equal(JuryCertificationSummary.statuses.STARTED);
      });
    });
  });

  describe('#isFlaggedAborted', function () {
    context('when the certification has been scored while started', function () {
      context('with abort reason', function () {
        it('should return isFlaggedAborted true', function () {
          // when
          const juryCertificationSummary = new JuryCertificationSummary({
            abortReason: 'candidate',
            completedAt: null,
            pixScore: 456,
          });

          // then
          expect(juryCertificationSummary.isFlaggedAborted).equal(true);
        });
      });

      context('without abort reason', function () {
        it('should return isFlaggedAborted false', function () {
          // when
          const juryCertificationSummary = new JuryCertificationSummary({
            abortReason: null,
            completedAt: null,
            pixScore: 456,
          });

          // then
          expect(juryCertificationSummary.isFlaggedAborted).equal(false);
        });
      });
    });

    context('when the certification has been scored while completed', function () {
      context('with abort reason', function () {
        it('should return isFlaggedAborted false', function () {
          // when
          const juryCertificationSummary = new JuryCertificationSummary({
            abortReason: 'candidate',
            completedAt: new Date(),
            pixScore: 456,
          });

          // then
          expect(juryCertificationSummary.isFlaggedAborted).equal(false);
        });
      });
    });
  });

  describe('#isActionRequired', function () {
    context('when the issue report is unresolved', function () {
      context('when the issue report is impactful', function () {
        it('should return true', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({
            certificationIssueReports: [domainBuilder.buildCertificationIssueReport.impactful({ resolvedAt: null })],
          });

          // when
          const isRequired = juryCertificationSummary.isActionRequired();

          // then
          expect(isRequired).to.be.true;
        });
      });

      context('when the issue report is not impactful', function () {
        it('should return false', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({
            certificationIssueReports: [domainBuilder.buildCertificationIssueReport.notImpactful({ resolvedAt: null })],
          });

          // when
          const isRequired = juryCertificationSummary.isActionRequired();

          // then
          expect(isRequired).to.be.false;
        });
      });
    });

    context('when the issue report is resolved', function () {
      context('when the issue report is impactful', function () {
        it('should return false', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({
            certificationIssueReports: [
              domainBuilder.buildCertificationIssueReport.impactful({
                resolvedAt: new Date('2020-01-01'),
                resolution: 'coucou',
              }),
            ],
          });

          // when
          const isRequired = juryCertificationSummary.isActionRequired();

          // then
          expect(isRequired).to.be.false;
        });
      });

      context('when the issue report is not impactful', function () {
        it('should return false', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({
            certificationIssueReports: [
              domainBuilder.buildCertificationIssueReport.notImpactful({ resolvedAt: new Date('2020-01-01') }),
            ],
          });

          // when
          const isRequired = juryCertificationSummary.isActionRequired();

          // then
          expect(isRequired).to.be.false;
        });
      });
    });
  });

  describe('#hasScoringError', function () {
    context('when assessment result has a scoring error', function () {
      it('should return true', function () {
        // given
        const juryCertificationSummary = new JuryCertificationSummary({ status: AssessmentResult.status.ERROR });

        // when
        const hasScoringError = juryCertificationSummary.hasScoringError();

        // then
        expect(hasScoringError).to.be.true;
      });

      context("when assessment result doesn't have a scoring error", function () {
        it('should return false', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({ status: AssessmentResult.status.VALIDATED });

          // when
          const hasScoringError = juryCertificationSummary.hasScoringError();

          // then
          expect(hasScoringError).to.be.false;
        });
      });
    });
  });

  describe('#hasCompletedAssessment', function () {
    context('when assessment is completed', function () {
      it('should return true', function () {
        // given
        const juryCertificationSummary = new JuryCertificationSummary({ status: AssessmentResult.status.REJECTED });

        // when
        const hasCompletedAssessment = juryCertificationSummary.hasCompletedAssessment();

        // then
        expect(hasCompletedAssessment).to.be.true;
      });

      context('when assessment is not completed', function () {
        it('should return false', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({ status: null });

          // when
          const hasCompletedAssessment = juryCertificationSummary.hasCompletedAssessment();

          // then
          expect(hasCompletedAssessment).to.be.false;
        });
      });
    });
  });

  describe('#getCertificationLabel', function () {
    context('when the certification taken is core', function () {
      it('should return the translated comment matching the key', function () {
        // given
        const translate = getI18n().__;
        const juryCertificationSummary = new JuryCertificationSummary({
          complementaryCertificationLabelObtained: null,
          complementaryCertificationKeyObtained: null,
        });

        // when
        const certificationLabel = juryCertificationSummary.getCertificationLabel(translate);

        // then
        expect(certificationLabel).to.equal(translate('jury-certification-summary.comment.CORE'));
      });
    });

    context('when the certification taken is a double certification', function () {
      it('should return the translated comment matching the key', function () {
        // given
        const translate = getI18n().__;
        const juryCertificationSummary = new JuryCertificationSummary({
          complementaryCertificationLabelObtained: 'CléA Numérique',
          complementaryCertificationKeyObtained: ComplementaryCertificationKeys.CLEA,
        });

        // when
        const certificationLabel = juryCertificationSummary.getCertificationLabel(translate);

        // then
        expect(certificationLabel).to.equal(translate('jury-certification-summary.comment.DOUBLE_CORE_CLEA'));
      });
    });

    context('when the certification taken is complementary', function () {
      it('should return the label', function () {
        // given
        const translate = getI18n().__;
        const juryCertificationSummary = new JuryCertificationSummary({
          complementaryCertificationLabelObtained: 'Pix+ Droit',
          complementaryCertificationKeyObtained: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
        });

        // when
        const certificationLabel = juryCertificationSummary.getCertificationLabel(translate);

        // then
        expect(certificationLabel).to.equal(translate('Pix+ Droit'));
      });
    });
  });
});
