import { certificationRescoringController } from '../../../../../src/certification/evaluation/application/certification-rescoring-controller.js';
import * as moduleUnderTest from '../../../../../src/certification/evaluation/application/certification-rescoring-route.js';
import { usecases } from '../../../../../src/certification/evaluation/domain/usecases/index.js';
import { securityPreHandlers } from '../../../../../src/shared/application/security-pre-handlers.js';
import { expect, HttpTestServer, sinon } from '../../../../test-helper.js';

describe('Certification | Evaluation | Unit | Application | Certification Rescoring Route', function () {
  describe('POST /api/admin/certifications/{certificationId}/rescore', function () {
    it('should call the usecase with correct arguments and return 204 status code', async function () {
      const certificationCourseId = 123;
      const locale = 'fr-fr';
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      sinon.stub(certificationRescoringController, 'rescoreCertification').returns('ok');
      sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request, h) => h.response(true));
      sinon.stub(usecases, 'rescoreCertification').resolves('ok');

      // when
      const response = await httpTestServer.request(
        'POST',
        `/api/admin/certifications/${certificationCourseId}/rescore`,
      );

      // then
      expect(usecases.rescoreCertification).to.have.been.calledWithExactly({ certificationCourseId, locale });
      expect(response.statusCode).to.equal(201);
    });
  });
});
