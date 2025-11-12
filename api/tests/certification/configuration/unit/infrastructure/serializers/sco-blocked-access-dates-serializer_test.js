import { ScoBlockedAccessDates } from '../../../../../../src/certification/configuration/domain/read-models/ScoBlockedAccessDates.js';
import * as serializer from '../../../../../../src/certification/configuration/infrastructure/serializers/sco-blocked-access-dates-serializer.js';
import { expect } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | Serializer | sco-blocked-access-dates-serializer', function () {
  describe('#serialize', function () {
    it('should serialize asco blocked access dates to JSONAPI', function () {
      // given
      const scoBlockedAccessDates = new ScoBlockedAccessDates({
        scoBlockedAccessDateLycee: new Date('2025-10-15'),
        scoBlockedAccessDateCollege: new Date('2025-11-10'),
      });

      // when
      const serializedScoBlockedAccessDates = serializer.serialize([scoBlockedAccessDates]);

      // then
      expect(serializedScoBlockedAccessDates).to.deep.equal({
        data: {
          attributes: {
            dates: [
              {
                scoBlockedAccessDateLycee: new Date('2025-10-15'),
                scoBlockedAccessDateCollege: new Date('2025-11-10'),
              },
            ],
          },
          type: 'sco-blocked-access-dates',
        },
      });
    });
  });
});
