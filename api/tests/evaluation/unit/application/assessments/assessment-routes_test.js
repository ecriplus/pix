import { expect } from 'chai';
import sinon from 'sinon';

import { assessmentController } from '../../../../../src/evaluation/application/assessments/assessment-controller.js';
import * as moduleUnderTest from '../../../../../src/evaluation/application/assessments/assessment-routes.js';
import { Assessment } from '../../../../../src/shared/domain/models/Assessment.js';
import { HttpTestServer } from '../../../../tooling/server/http-test-server.js';

describe('Evaluation | Unit | Application | assessment-routes', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('POST /api/assessments', function () {
    it('should return 200', async function () {
      // given
      sinon.stub(assessmentController, 'save').callsFake((request, h) => h.response('ok').code(200));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const payload = {
        data: {
          attributes: {
            type: Assessment.types.DEMO,
          },
        },
      };

      // when
      const response = await httpTestServer.request('POST', '/api/assessments', payload);

      // then
      expect(response.statusCode).to.equal(200);
    });

    describe('When type is not defined', function () {
      it('should return 400 Bad request', async function () {
        // given
        sinon.stub(assessmentController, 'save').callsFake((request, h) => h.response('ok').code(200));
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        // when
        const response = await httpTestServer.request('POST', '/api/assessments');

        // then
        expect(response.statusCode).to.equal(400);
        expect(response.statusMessage).to.equal('Bad Request');
        sinon.assert.notCalled(assessmentController.save);
      });
    });
  });
});
