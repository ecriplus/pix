import { getOrganizationToJoin } from '../../../../../../src/prescription/organization-learner/domain/usecases/get-organization-to-join.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCases | get-organization-to-join', function () {
  let campaignRepository;
  let organizationToJoinRepository;

  beforeEach(async function () {
    campaignRepository = { getByCode: sinon.stub() };
    organizationToJoinRepository = { get: sinon.stub() };
  });

  it('should return an organization given a valid code', async function () {
    //given
    const campaign = domainBuilder.buildCampaign({ organizationId: 1, code: 'ABC' });
    campaignRepository.getByCode.resolves(campaign);
    const organizationToJoin = Symbol('organization-to-join');
    organizationToJoinRepository.get.resolves(organizationToJoin);

    //when
    const result = await getOrganizationToJoin({
      code: campaign.code,
      organizationToJoinRepository,
      campaignRepository,
    });

    //then
    expect(result).to.equal(organizationToJoin);
    expect(campaignRepository.getByCode).to.have.been.calledWith('ABC');
    expect(organizationToJoinRepository.get).to.have.been.calledWith({ id: 1 });
  });

  it('should return a not found error if no organization is found for the given code', async function () {
    //given
    campaignRepository.getByCode.resolves(null);

    //when
    const error = await catchErr(getOrganizationToJoin)({
      code: 'ABC',
      organizationToJoinRepository,
      campaignRepository,
    });

    //then
    expect(error).to.be.instanceOf(NotFoundError);
    expect(error.message).to.equal('Aucun parcours trouvé pour le code ABC');
  });
});
