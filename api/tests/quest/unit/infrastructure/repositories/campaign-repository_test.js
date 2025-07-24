import { Campaign } from '../../../../../src/quest/domain/models/Campaign.js';
import * as campaignRepository from '../../../../../src/quest/infrastructure/repositories/campaign-repository.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Quest | Unit | Infrastructure | Repositories | campaign', function () {
  let id;
  let code;
  let campaignsApiStub;

  beforeEach(function () {
    id = Symbol('id');
    code = Symbol('code');
    campaignsApiStub = {
      get: sinon.stub(),
      getByCode: sinon.stub(),
    };
    campaignsApiStub.get.withArgs(id).resolves(new Campaign({}));
    campaignsApiStub.getByCode.withArgs(code).resolves(new Campaign({}));
  });

  describe('#get', function () {
    it('should call get method from campaignsApi', async function () {
      // when
      const result = await campaignRepository.get({ id, campaignsApi: campaignsApiStub });

      // then
      expect(result).to.be.an.instanceof(Campaign);
    });
  });
});
