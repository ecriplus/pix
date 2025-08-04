import { Campaign } from '../../../../../src/quest/domain/models/Campaign.js';
import * as campaignRepository from '../../../../../src/quest/infrastructure/repositories/campaign-repository.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Quest | Unit | Infrastructure | Repositories | campaign', function () {
  let id;
  let code;
  let campaignsApiStub;
  let expectedResult;

  beforeEach(function () {
    id = Symbol('id');
    code = Symbol('code');
    expectedResult = {
      id: 1,
      name: 'campagne',
      code: 'abc',
      targetProfileId: 123,
    };
    campaignsApiStub = {
      get: sinon.stub(),
      getByCode: sinon.stub(),
    };
    campaignsApiStub.get.withArgs(id).resolves(new Campaign(expectedResult));
    campaignsApiStub.getByCode.withArgs(code).resolves(new Campaign(expectedResult));
  });

  describe('#get', function () {
    it('should call get method from campaignsApi', async function () {
      // when
      const result = await campaignRepository.get({ id, campaignsApi: campaignsApiStub });

      // then
      expect(result).to.be.an.instanceof(Campaign);
      expect(result).to.deep.equal(expectedResult);
    });
  });

  describe('#getByCode', function () {
    it('should call getByCode method from campaignsApi', async function () {
      // when
      const result = await campaignRepository.getByCode({ code, campaignsApi: campaignsApiStub });

      // then
      expect(result).to.be.an.instanceof(Campaign);
      expect(result).to.deep.equal(expectedResult);
    });
  });
});
