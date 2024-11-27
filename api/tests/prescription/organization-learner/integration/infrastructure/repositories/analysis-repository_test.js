import * as analysisRepository from '../../../../../../src/prescription/organization-learner/infrastructure/repositories/analysis-repository.js';
import { config } from '../../../../../../src/shared/config.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Integration | Infrastructure | Repository | Analysis', function () {
  describe('#findByTubes', function () {
    context('when they work properly', function () {
      it('should call api data and return it', async function () {
        const organizationId = Symbol('organization-id');
        const apiDataDatasource = {
          get: sinon.stub(),
        };

        sinon.stub(config, 'apiData').value({
          queries: {
            coverRateByTubes: Symbol('cover-query-id'),
          },
        });

        const queryId = config.apiData.queries.coverRateByTubes;
        const params = [{ name: 'organization_id', value: organizationId }];

        const expectedData = Symbol('api-data-result');
        apiDataDatasource.get.withArgs(queryId, params).resolves(expectedData);

        const result = await analysisRepository.findByTubes({ organizationId, apiDataDatasource });

        expect(result).to.equal(expectedData);
      });
    });
  });
});
