import * as serializer from '../../../../../../../src/organizational-entities/infrastructure/serializers/jsonapi/network/network.serializer.js';
import { expect } from '../../../../../../test-helper.js';

describe('Unit | Infrastructure | Serializers | JsonApi |  Network | network-serializer', function () {
  describe('#deserialize', function () {
    it('should convert JSON API data to a Organization', function () {
      // given
      const formData = {
        networkName: 'Some network name',
        organizationId: 123,
      };

      const jsonApiFormData = {
        data: {
          attributes: {
            'network-name': formData.networkName,
            'organization-id': formData.organizationId,
          },
        },
      };

      // when
      const deserializedData = serializer.deserialize(jsonApiFormData);

      // then
      expect(deserializedData).to.deep.equal({
        networkName: formData.networkName,
        organizationId: formData.organizationId,
      });
    });
  });
});
