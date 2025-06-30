import { config } from '../../../../src/shared/config.js';
import { asyncLocalStorage } from '../../../../src/shared/infrastructure/async-local-storage.js';
import { getRequestId } from '../../../../src/shared/infrastructure/monitoring-tools.js';
import { expect, sinon } from '../../../test-helper.js';

describe('Shared | Unit | Infrastructure | monitoring-tools', function () {
  describe('#getRequestId', function () {
    it('should return null when request monitoring is disabled', function () {
      // given
      sinon.stub(config.hapi, 'enableRequestMonitoring').value(false);

      // then
      expect(getRequestId()).equal(null);
    });

    it('should return request ID when request monitoring is enabled', function () {
      // given
      sinon.stub(config.hapi, 'enableRequestMonitoring').value(true);

      const expectedRequestId = Symbol('RequestId');
      const context = { request: { headers: { 'x-request-id': expectedRequestId } } };
      sinon.stub(asyncLocalStorage, 'getStore');
      asyncLocalStorage.getStore.returns(context);

      // when
      const requestId = getRequestId();

      // then
      expect(requestId).equal(expectedRequestId);
    });
  });
});
