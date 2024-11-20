import { userAccountInfoSerializer } from '../../../../../../src/identity-access-management/infrastructure/serializers/jsonapi/user-account-info.serializer.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Identity Access Management | Infrastructure | Serializer | JSONAPI | user-account-info', function () {
  describe('#serialize', function () {
    it('serializes user account information', function () {
      // given
      const userAccountInfo = {
        email: 'user@email.com',
        username: 'my-username',
        canSelfDeleteAccount: true,
      };

      // when
      const json = userAccountInfoSerializer.serialize(userAccountInfo);

      // then
      expect(json).to.be.deep.equal({
        data: {
          type: 'account-infos',
          attributes: {
            email: 'user@email.com',
            username: 'my-username',
            'can-self-delete-account': true,
          },
        },
      });
    });
  });
});
