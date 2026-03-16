import { networkAdminController } from '../../../../../src/organizational-entities/application/network/network.admin.controller.js';
import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import { domainBuilder, expect, hFake, sinon } from '../../../../test-helper.js';

describe('Unit | Organizational Entities | Application | Network', function () {
  describe('#findAllNetworks', function () {
    it('calls findAllNetworks usecase and Network serializer', async function () {
      // given
      const network1 = domainBuilder.acquisition.buildNetwork({ id: 1, name: 'Network 1' });
      const network2 = domainBuilder.acquisition.buildNetwork({ id: 2, name: 'Network 2' });
      const networks = [network1, network2];
      sinon.stub(usecases, 'findAllNetworks').resolves(networks);
      const networkSerializer = { serialize: sinon.stub() };

      // when
      await networkAdminController.findAllNetworks({}, hFake, { networkSerializer });

      // then
      expect(usecases.findAllNetworks).to.have.been.calledOnce;
      expect(networkSerializer.serialize).to.have.been.calledWithExactly(networks);
    });
  });

  describe('#getNetworkDetails', function () {
    it('calls getNetworkById usecase and Network serializer', async function () {
      // given
      const network = domainBuilder.acquisition.buildNetwork({
        id: 1,
        name: 'Mon Réseau',
        organizationId: 555,
        organizationName: 'Tête de réseau',
      });

      const networkId = 1;

      const requestStub = { params: { networkId } };
      sinon.stub(usecases, 'getNetworkDetails').resolves(network);
      const networkSerializer = { serialize: sinon.stub() };

      // when
      await networkAdminController.getNetworkDetails(requestStub, hFake, { networkSerializer });

      // then
      expect(usecases.getNetworkDetails).to.have.been.calledOnce;
      expect(networkSerializer.serialize).to.have.been.calledWithExactly(network);
    });
  });

  describe('#create', function () {
    context('when payload contains only required fields', function () {
      it('calls "createNetwork" use case with the right parameters', async function () {
        // given
        const request = {
          payload: {
            data: {
              attributes: {
                name: 'Network name',
                'organization-id': 123,
              },
            },
          },
        };
        const createNetworkStub = sinon.stub(usecases, 'createNetwork');
        const createdNetwork = createNetworkStub.resolves(Symbol('createdNetwork'));
        const serializedNetwork = Symbol('serializedNetwork');
        const networkSerializerStub = { serialize: sinon.stub() };
        networkSerializerStub.serialize.withArgs(createdNetwork).returns(serializedNetwork);
        const dependencies = {
          networkSerializer: networkSerializerStub,
        };

        // when
        await networkAdminController.create(request, hFake, dependencies);

        // then
        expect(createNetworkStub).to.have.been.calledOnceWith({
          networkName: 'Network name',
          organizationId: 123,
        });
      });
    });
  });
});
