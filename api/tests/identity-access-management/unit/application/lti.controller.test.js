import { ltiController } from '../../../../src/identity-access-management/application/lti/lti.controller.js';
import { expect, hFake, sinon } from '../../../test-helper.js';

describe('Unit | Identity Access Management | Application | Controller | LTI', function () {
  describe('#listPublicKeys', function () {
    it('should call list public keys use-case', async function () {
      const expectedPublicKeys = Symbol('public-keys');
      const listLtiPublicKeys = sinon.stub().resolves(expectedPublicKeys);

      const response = await ltiController.listPublicKeys('', hFake, { listLtiPublicKeys });

      expect(response.statusCode).to.equal(200);
      expect(response.source).to.equal(expectedPublicKeys);
    });
  });
});
