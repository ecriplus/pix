import { ComplementaryCertificationKeys } from '../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
} from '../../../test-helper.js';

describe('Acceptance | Controller | session-controller-get-jury-certification-summaries', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/admin/sessions/{id}/jury-certification-summaries', function () {
    let sessionId;

    beforeEach(function () {
      sessionId = databaseBuilder.factory.buildSession().id;

      return databaseBuilder.commit();
    });

    context('when user has not the role Super Admin', function () {
      let userId;

      beforeEach(function () {
        userId = databaseBuilder.factory.buildUser().id;
        return databaseBuilder.commit();
      });

      it('should return 403 HTTP status code', async function () {
        // when
        const response = await server.inject({
          method: 'GET',
          url: `/api/admin/sessions/${sessionId}/jury-certification-summaries`,
          payload: {},
          headers: generateAuthenticatedUserRequestHeaders({ userId }),
        });

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    context('when user has role Super Admin', function () {
      it('should return the expected data', async function () {
        // given
        const superAdminId = databaseBuilder.factory.buildUser.withRole().id;
        sessionId = databaseBuilder.factory.buildSession().id;
        const badge = databaseBuilder.factory.buildBadge();

        const complementaryCertificationId = databaseBuilder.factory.buildComplementaryCertification({
          label: 'CléA Numérique',
          key: ComplementaryCertificationKeys.CLEA,
        }).id;
        const complementaryCertificationBadgeId = databaseBuilder.factory.buildComplementaryCertificationBadge({
          badgeId: badge.id,
          complementaryCertificationId,
          label: 'CléA Numérique',
        }).id;

        const certificationCourse1 = databaseBuilder.factory.buildCertificationCourse({ sessionId, lastName: 'AAA' });
        const { id } = databaseBuilder.factory.buildComplementaryCertificationCourse({
          certificationCourseId: certificationCourse1.id,
          name: ComplementaryCertificationKeys.CLEA,
          complementaryCertificationId,
          complementaryCertificationBadgeId,
        });
        databaseBuilder.factory.buildComplementaryCertificationCourseResult({
          complementaryCertificationCourseId: id,
          complementaryCertificationBadgeId,
          acquired: true,
        });
        const asr1 = databaseBuilder.factory.buildAssessmentResult.last({
          certificationCourseId: certificationCourse1.id,
          createdAt: new Date('2018-04-15T00:00:00Z'),
        });

        const certificationCourse2 = databaseBuilder.factory.buildCertificationCourse({ sessionId, lastName: 'CCC' });
        databaseBuilder.factory.buildAssessment({ certificationCourseId: certificationCourse2.id });
        await databaseBuilder.commit();

        const request = {
          method: 'GET',
          url: `/api/admin/sessions/${sessionId}/jury-certification-summaries`,
          payload: {},
          headers: generateAuthenticatedUserRequestHeaders({ userId: superAdminId }),
        };

        // when
        const response = await server.inject(request);

        // then
        const expectedJuryCertificationSummary1 = {
          'first-name': certificationCourse1.firstName,
          'last-name': certificationCourse1.lastName,
          status: asr1.status,
          'pix-score': asr1.pixScore,
          'is-published': certificationCourse1.isPublished,
          'created-at': certificationCourse1.createdAt,
          'completed-at': certificationCourse1.completedAt,
          'number-of-certification-issue-reports': 0,
          'number-of-certification-issue-reports-with-required-action': 0,
          'certification-obtained': 'Double Certification Pix/CléA Numérique',
          'examiner-comment': undefined,
          'is-flagged-aborted': false,
        };
        const expectedJuryCertificationSummary2 = {
          'first-name': certificationCourse2.firstName,
          'last-name': certificationCourse2.lastName,
          status: 'started',
          'pix-score': null,
          'is-published': certificationCourse2.isPublished,
          'created-at': certificationCourse2.createdAt,
          'number-of-certification-issue-reports': 0,
          'number-of-certification-issue-reports-with-required-action': 0,
          'certification-obtained': 'Certification Pix',
          'completed-at': certificationCourse2.completedAt,
          'examiner-comment': undefined,
          'is-flagged-aborted': false,
        };

        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.deep.equal([
          {
            type: 'jury-certification-summaries',
            id: certificationCourse1.id.toString(),
            attributes: expectedJuryCertificationSummary1,
          },
          {
            type: 'jury-certification-summaries',
            id: certificationCourse2.id.toString(),
            attributes: expectedJuryCertificationSummary2,
          },
        ]);
      });
    });
  });
});
