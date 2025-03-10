import { listLtiPublicKeys } from '../../../../../src/identity-access-management/domain/usecases/list-lti-public-keys.usecase.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Domain | Usecases | ListLtiPublicKeys', function () {
  it('should return LTI public keys', async function () {
    const publicKeys = Symbol('publicKeys');

    const ltiPlatformRegistrationRepository = {
      listActivePublicKeys: sinon.stub().resolves(publicKeys),
    };

    const keys = await listLtiPublicKeys({ ltiPlatformRegistrationRepository });

    expect(keys).to.deep.equal(publicKeys);
  });
});
