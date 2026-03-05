import { networkAdminController } from '../../../../../src/organizational-entities/application/network/network.admin.controller.js';
import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import { expect, hFake, sinon } from '../../../../test-helper.js';

describe('Unit | Organizational Entities | Application | Network', function () {
  describe('#create', function () {
    context('when payload contains only required fields', function () {
      it('calls "createNetwork" use case with the right parameters', async function () {
        // given
        const request = {
          payload: {
            data: {
              attributes: {
                'network-name': 'Network name',
                'organization-id': 123,
              },
            },
          },
        };
        const createNetworkStub = sinon.stub(usecases, 'createNetwork');

        // when
        await networkAdminController.create(request, hFake);

        // then
        expect(createNetworkStub).to.have.been.calledOnceWith({
          networkName: 'Network name',
          organizationId: 123,
        });
      });
    });
  });
});
