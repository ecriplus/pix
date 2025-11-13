import * as serializer from '../../../../../../src/certification/configuration/infrastructure/serializers/sco-blocked-access-dates-serializer.js';
import { domainBuilder, expect } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | Serializer | sco-blocked-access-dates-serializer', function () {
  describe('#serialize', function () {
    it('should serialize asco blocked access dates to JSONAPI', function () {
      // given
      const scoBlockedAccessDates = [
        domainBuilder.certification.configuration.buildScoBlockedAccessDate({
          scoOrganizationType: 'lycee',
          reopeningDate: new Date('2025-10-15'),
        }),
        domainBuilder.certification.configuration.buildScoBlockedAccessDate({
          scoOrganizationType: 'college',
          reopeningDate: new Date('2025-11-15'),
        }),
      ];

      // when
      const serializedScoBlockedAccessDates = serializer.serialize(scoBlockedAccessDates);

      // then
      expect(serializedScoBlockedAccessDates).to.deep.equal({
        data: [
          {
            type: 'sco-blocked-access-dates',
            attributes: {
              scoOrganizationType: 'lycee',
              reopeningDate: new Date('2025-10-15'),
            },
          },
          {
            type: 'sco-blocked-access-dates',
            attributes: {
              scoOrganizationType: 'college',
              reopeningDate: new Date('2025-11-15'),
            },
          },
        ],
      });
    });
  });
});
