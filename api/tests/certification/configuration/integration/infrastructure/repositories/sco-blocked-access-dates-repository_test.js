import * as scoBlockedAccessDatesRepository from '../../../../../../src/certification/configuration/infrastructure/repositories/sco-blocked-access-dates-repository.js';
import { databaseBuilder, domainBuilder, expect, knex } from '../../../../../test-helper.js';

describe('Certification | Configuration | Integration | Repository | sco-blocked-access-dates-repository', function () {
  describe('#getScoBlockedAccessDates', function () {
    it('should get blocked access dates ', async function () {
      // given
      databaseBuilder.factory.buildScoBlockedAccessDates();
      await databaseBuilder.commit();

      const scoBlockedAccessDates = [
        domainBuilder.certification.configuration.buildScoBlockedAccessDate({
          scoOrganizationType: 'college',
          reopeningDate: new Date('2025-11-15'),
        }),
        domainBuilder.certification.configuration.buildScoBlockedAccessDate({
          scoOrganizationType: 'lycee',
          reopeningDate: new Date('2025-10-15'),
        }),
      ];

      //when
      const results = await scoBlockedAccessDatesRepository.getScoBlockedAccessDates();

      //then
      expect(results).to.have.lengthOf(2);
      expect(results).to.deepEqualInstance(scoBlockedAccessDates);
    });
  });
  describe('#updateScoBlockedAccessDate', function () {
    it('should update blocked access dates ', async function () {
      // given
      databaseBuilder.factory.buildScoBlockedAccessDates();
      await databaseBuilder.commit();

      //when
      await scoBlockedAccessDatesRepository.updateScoBlockedAccessDate({
        scoOrganizationType: 'lycee',
        reopeningDate: new Date('2025-12-15'),
      });

      //then
      const [updatedValue] = await knex('sco_blocked_access_dates')
        .where({ scoOrganizationType: 'lycee' })
        .pluck('reopeningDate');
      expect(updatedValue.toDateString()).to.equal(new Date('2025-12-15').toDateString());
    });
  });
});
