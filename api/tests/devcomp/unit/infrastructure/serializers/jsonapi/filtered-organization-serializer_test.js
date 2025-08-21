import { FilteredOrganization } from '../../../../../../src/devcomp/domain/models/trainings/FilteredOrganization.js';
import * as serializer from '../../../../../../src/devcomp/infrastructure/serializers/jsonapi/filtered-organization-serializer.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Serializer | filtered-organization-serializer', function () {
  describe('#serialize', function () {
    it('should return a JSON API serialized organization', function () {
      const page = { number: 1, size: 10 };
      const pagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };
      const targetProfileTrainingId = '2';
      const organizationId = '1';
      const filteredOrganization = new FilteredOrganization({
        targetProfileTrainingId,
        type: 'SCO',
        name: 'Orga 1',
        externalId: 'SCO_Orga 1',
        isExcluded: false,
        organizationId,
      });

      // when
      const result = serializer.serialize(filteredOrganization, pagination);

      // then
      expect(result).to.deep.equal({
        data: {
          type: 'training-target-profile-organizations',
          id: filteredOrganization.id.toString(),
          attributes: {
            name: filteredOrganization.name,
            type: filteredOrganization.type,
            'external-id': filteredOrganization.externalId,
            'is-excluded': filteredOrganization.isExcluded,
            'organization-id': organizationId,
          },
        },
        meta: {
          ...pagination,
        },
      });
    });
  });
});
