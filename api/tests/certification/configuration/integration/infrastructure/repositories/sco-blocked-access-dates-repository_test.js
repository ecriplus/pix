import * as ScoBlockedAccessDatesRepository from '../../../../../../src/certification/configuration/infrastructure/repositories/sco-blocked-access-dates-repository.js';
import { databaseBuilder, domainBuilder, expect, knex } from '../../../../../test-helper.js';

describe('Certification | Configuration | Integration | Repository | sco-blocked-access-dates-repository', function () {
  describe('#getScoBlockedAccessDates', function () {
    it('should get blocked access dates ', async function () {
      // given
      databaseBuilder.factory.buildScoBlockedAccessDates();
      await databaseBuilder.commit();

      const scoBlockedAccessDates = [
        domainBuilder.certification.configuration.buildScoBlockedAccessDateCollege(),
        domainBuilder.certification.configuration.buildScoBlockedAccessDateLycee(),
      ];

      //when
      const results = await ScoBlockedAccessDatesRepository.getScoBlockedAccessDates();

      //then
      expect(results).to.have.lengthOf(2);
      expect(results).to.deepEqualInstance(scoBlockedAccessDates);
    });
  });
  describe('#findScoBlockedAccessDateByKey', function () {
    it('should find the blocked access date with given key ', async function () {
      // given
      databaseBuilder.factory.buildScoBlockedAccessDates();
      await databaseBuilder.commit();

      const scoBlockedAccessDates = [
        domainBuilder.certification.configuration.buildScoBlockedAccessDateCollege(),
        domainBuilder.certification.configuration.buildScoBlockedAccessDateLycee(),
      ];

      //when
      const results = await ScoBlockedAccessDatesRepository.findScoBlockedAccessDateByKey('LYCEE');

      //then
      expect(results).to.deepEqualInstance(scoBlockedAccessDates[1]);
    });
  });
  describe('#updateScoBlockedAccessDate', function () {
    it('should update blocked access dates ', async function () {
      // given
      databaseBuilder.factory.buildScoBlockedAccessDates();
      await databaseBuilder.commit();

      //when
      await ScoBlockedAccessDatesRepository.updateScoBlockedAccessDate({
        scoOrganizationTagName: 'LYCEE',
        reopeningDate: new Date('2025-12-15'),
      });

      //then
      const [updatedValue] = await knex('certification_sco_blocked_access_dates')
        .where({ scoOrganizationTagName: 'LYCEE' })
        .pluck('reopeningDate');
      expect(updatedValue.toDateString()).to.equal(new Date('2025-12-15').toDateString());
    });
  });
});
