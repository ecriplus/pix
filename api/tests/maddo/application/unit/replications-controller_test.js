import { replicate } from '../../../../src/maddo/application/replications-controller.js';
import { expect, sinon } from '../../../test-helper.js';

describe('Maddo | Application | Unit | Controller | Replication', function () {
  describe('#replicate', function () {
    it('should call use-case with given replication', async function () {
      // given
      const replicationName = 'foo';
      const replication = Symbol('replication');
      const request = {
        params: {
          replicationName,
        },
        query: {
          async: false,
        },
      };
      const codeStub = sinon.stub();
      const h = {
        response: () => ({
          code: codeStub,
        }),
      };
      const extractTransformAndLoadData = sinon.stub().resolves();
      const replicationRepository = {
        getByName: sinon.stub().withArgs(replicationName).returns(replication),
      };
      const datawarehouseKnex = Symbol('datawarehouse-knex');
      const datamartKnex = Symbol('datamart-knex');

      // when
      await replicate(request, h, {
        extractTransformAndLoadData,
        replicationRepository,
        datamartKnex,
        datawarehouseKnex,
      });

      // then
      expect(extractTransformAndLoadData).to.have.been.calledWithExactly({
        replication,
        datamartKnex,
        datawarehouseKnex,
      });
      expect(codeStub).to.have.been.calledWithExactly(204);
    });

    context('when usecase throw an error', function () {
      it('should log error', async function () {
        // given
        const replicationName = 'foo';
        const replication = Symbol('replication');
        const request = {
          params: {
            replicationName,
          },
          query: {
            async: false,
          },
        };
        const codeStub = sinon.stub();
        const h = {
          response: () => ({
            code: codeStub,
          }),
        };

        const error = new Error('extract-error');
        const extractTransformAndLoadData = sinon.stub().rejects(error);
        const logger = {
          error: sinon.stub(),
        };
        const replicationRepository = {
          getByName: sinon.stub().withArgs(replicationName).returns(replication),
        };

        // when
        await replicate(request, h, { extractTransformAndLoadData, replicationRepository, logger });

        // then
        expect(logger.error).to.have.been.calledWithExactly(
          {
            event: 'replication',
            err: error,
          },
          'Error during replication',
        );
        expect(codeStub).to.have.been.calledWithExactly(204);
      });
    });

    context('when replication name is unknown', function () {
      it('should return 404 status code', async function () {
        // given
        const replicationName = 'unknown';
        const request = {
          params: {
            replicationName,
          },
          query: {
            async: false,
          },
        };
        const codeStub = sinon.stub();
        const h = {
          response: () => ({
            code: codeStub,
          }),
        };

        const replicationRepository = {
          getByName: sinon.stub().withArgs(replicationName).returns(undefined),
        };
        const extractTransformAndLoadData = sinon.stub();

        // when
        await replicate(request, h, { extractTransformAndLoadData, replicationRepository });

        // then
        expect(codeStub).to.have.been.calledWithExactly(404);
        expect(extractTransformAndLoadData).not.to.have.been.called;
      });
    });
  });
});
