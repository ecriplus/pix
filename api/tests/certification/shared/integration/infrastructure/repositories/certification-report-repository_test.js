import sinon from 'sinon';

import { CertificationIssueReportCategory } from '../../../../../../src/certification/shared/domain/models/CertificationIssueReportCategory.js';
import { CertificationReport } from '../../../../../../src/certification/shared/domain/models/CertificationReport.js';
import * as certificationReportRepository from '../../../../../../src/certification/shared/infrastructure/repositories/certification-report-repository.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../../test-helper.js';

describe('Integration | Repository | CertificationReport', function () {
  describe('#findBySessionId', function () {
    context('when there are some certification reports with the given session id', function () {
      it('should fetch, alphabetically sorted, the certification reports with a specific session ID', async function () {
        // given
        const sessionId = databaseBuilder.factory.buildSession().id;
        const certificationCourse1 = databaseBuilder.factory.buildCertificationCourse({ lastName: 'Abba', sessionId });
        databaseBuilder.factory.buildAssessment({
          certificationCourseId: certificationCourse1.id,
          state: Assessment.states.COMPLETED,
          type: Assessment.types.CERTIFICATION,
        });
        const certificationCourse2 = databaseBuilder.factory.buildCertificationCourse({ lastName: 'Xubbu', sessionId });
        databaseBuilder.factory.buildAssessment({
          certificationCourseId: certificationCourse2.id,
          state: Assessment.states.COMPLETED,
          type: Assessment.types.CERTIFICATION,
        });
        const certificationIssueReport1 = databaseBuilder.factory.buildCertificationIssueReport({
          certificationCourseId: certificationCourse1.id,
          category: CertificationIssueReportCategory.OTHER,
          description: 'Houston, nous avons un problème',
        });
        // In other session
        const anotherSessionId = databaseBuilder.factory.buildSession().id;
        databaseBuilder.factory.buildCertificationCourse({ anotherSessionId });

        await databaseBuilder.commit();

        // when
        const certificationReports = await certificationReportRepository.findBySessionId({ sessionId });

        // then
        const expectedCertificationReport1 = domainBuilder.buildCertificationReport({
          id: CertificationReport.idFromCertificationCourseId(certificationCourse1.id),
          certificationCourseId: certificationCourse1.id,
          firstName: certificationCourse1.firstName,
          lastName: certificationCourse1.lastName,
          isCompleted: true,
          certificationIssueReports: [{ ...certificationIssueReport1, isImpactful: true }],
        });
        const expectedCertificationReport2 = domainBuilder.buildCertificationReport({
          id: CertificationReport.idFromCertificationCourseId(certificationCourse2.id),
          certificationCourseId: certificationCourse2.id,
          firstName: certificationCourse2.firstName,
          lastName: certificationCourse2.lastName,
          isCompleted: true,
          certificationIssueReports: [],
        });
        expect(certificationReports).to.deep.equal([expectedCertificationReport1, expectedCertificationReport2]);
      });
    });

    context('when there is no certification reports with the given session ID', function () {
      it('should return an empty array', async function () {
        // given
        const sessionId = databaseBuilder.factory.buildSession().id;

        // when
        const certificationReports = await certificationReportRepository.findBySessionId({ sessionId });

        // then
        expect(certificationReports).to.deep.equal([]);
      });
    });
  });

  describe('#finalizeAll', function () {
    let sessionId;

    beforeEach(function () {
      // given
      sessionId = databaseBuilder.factory.buildSession().id;

      return databaseBuilder.commit();
    });

    context('when reports are being successfully finalized', function () {
      let clock, now;

      beforeEach(function () {
        now = new Date('2024-11-16');
        clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
      });

      afterEach(function () {
        clock.restore();
      });

      it('should finalize certification reports', async function () {
        const certificationCourse1 = databaseBuilder.factory.buildCertificationCourse({
          sessionId,
        });

        const certificationCourse2 = databaseBuilder.factory.buildCertificationCourse({
          sessionId,
        });

        await databaseBuilder.commit();

        // given
        const certificationReport1 = domainBuilder.buildCertificationReport({
          sessionId,
          certificationCourseId: certificationCourse1.id,
        });

        const certificationReport2 = domainBuilder.buildCertificationReport({
          sessionId,
          certificationCourseId: certificationCourse2.id,
        });

        // when
        await certificationReportRepository.finalizeAll({
          certificationReports: [certificationReport1, certificationReport2],
        });

        // then
        const updatedCertificationReport1 = await databaseBuilder
          .knex('certification-courses')
          .where({ id: certificationCourse1.id })
          .first();

        const updatedCertificationReport2 = await databaseBuilder
          .knex('certification-courses')
          .where({ id: certificationCourse2.id })
          .first();

        expect(updatedCertificationReport1.updatedAt).to.deep.equal(now);
        expect(updatedCertificationReport2.updatedAt).to.deep.equal(now);
      });
    });
  });
});
