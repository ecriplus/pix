import { getOrganizationToJoin } from '../../../../../../src/prescription/organization-learner/domain/usecases/get-organization-to-join.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { catchErr, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCases | get-organization-to-join', function () {
  let campaignRepository;
  let organizationToJoinRepository;
  let questRepository;

  beforeEach(async function () {
    campaignRepository = { getByCode: sinon.stub() };
    organizationToJoinRepository = { get: sinon.stub() };
    questRepository = { getByCode: sinon.stub() };
  });

  it('should throw a not found error if both campaign and quest are not found', async function () {
    //given
    campaignRepository.getByCode.resolves(null);
    questRepository.getByCode.rejects(new NotFoundError());

    //when
    const error = await catchErr(getOrganizationToJoin)({
      code: 'ABC',
      organizationToJoinRepository,
      campaignRepository,
      questRepository,
    });

    //then
    expect(error).to.be.instanceOf(NotFoundError);
  });
});
