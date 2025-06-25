import * as serializer from '../../../../../../src/certification/configuration/infrastructure/serializers/consolidated-framework-serializer.js';
import { expect } from '../../../../../test-helper.js';
import { domainBuilder } from '../../../../../tooling/domain-builder/domain-builder.js';

describe('Certification | Configuration | Unit | Serializer | consolidated-framework-serializer', function () {
  describe('#serialize', function () {
    it('should serialize attachable a consolidated framework to JSONAPI', function () {
      // given
      const consolidatedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework();

      // when
      const serializedConsolidatedFramework = serializer.serialize([consolidatedFramework]);

      // then
      expect(serializedConsolidatedFramework).to.deep.equal({
        data: [
          {
            type: 'certification-consolidated-frameworks',
            attributes: {
              'complementary-certification-key': consolidatedFramework.complementaryCertificationKey,
              'created-at': consolidatedFramework.createdAt,
              'tube-ids': consolidatedFramework.tubeIds,
            },
          },
        ],
      });
    });
  });
});
