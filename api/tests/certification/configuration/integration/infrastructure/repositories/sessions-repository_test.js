import { configurationRepositories } from '../../../../../../src/certification/configuration/infrastructure/repositories/index.js';
import { databaseBuilder, expect, knex } from '../../../../../test-helper.js';

describe('Certification | Configuration | Integration | Repository | sessions-repository', function () {
  describe('updateV2SessionsWithNoCourses', function () {
    it('should update v2 sessions with no courses of v3 centers', async function () {
      // given
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
        isV3Pilot: true,
      }).id;
      const activeSessionId = databaseBuilder.factory.buildSession({
        version: 2,
        certificationCenterId,
      }).id;
      databaseBuilder.factory.buildCertificationCourse({ sessionId: activeSessionId });
      const inactiveSessionId = databaseBuilder.factory.buildSession({
        version: 2,
        certificationCenterId,
      }).id;
      await databaseBuilder.commit();

      // when
      const count = await configurationRepositories.sessionsRepository.updateV2SessionsWithNoCourses();

      // then
      expect(count).to.equal(1);
      const sessions = await knex('sessions').select('id', 'version').orderBy('version');
      expect(sessions).to.deep.equal([
        { id: activeSessionId, version: 2 },
        { id: inactiveSessionId, version: 3 },
      ]);
    });

    it('should not update v2 sessions with no courses of v2 centers', async function () {
      // given
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
        isV3Pilot: false,
      }).id;
      const activeSessionId = databaseBuilder.factory.buildSession({
        version: 2,
        certificationCenterId,
      }).id;
      databaseBuilder.factory.buildCertificationCourse({ sessionId: activeSessionId });
      const inactiveSessionId = databaseBuilder.factory.buildSession({
        version: 2,
        certificationCenterId,
      }).id;
      await databaseBuilder.commit();

      // when
      const count = await configurationRepositories.sessionsRepository.updateV2SessionsWithNoCourses();

      // then
      expect(count).to.equal(0);
      const sessions = await knex('sessions').select('id', 'version').orderBy('version');
      expect(sessions).to.deep.equal([
        { id: activeSessionId, version: 2 },
        { id: inactiveSessionId, version: 2 },
      ]);
    });
  });

  describe('findV2SessionIdsWithNoCourses', function () {
    it('should return v2 session ids with no courses of v3 centers', async function () {
      // given
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
        isV3Pilot: true,
      }).id;
      const activeSessionId = databaseBuilder.factory.buildSession({
        version: 2,
        certificationCenterId,
      }).id;
      databaseBuilder.factory.buildCertificationCourse({ sessionId: activeSessionId });
      const inactiveSessionId = databaseBuilder.factory.buildSession({
        version: 2,
        certificationCenterId,
      }).id;
      const v2CertificationCenterId = databaseBuilder.factory.buildCertificationCenter({
        isV2Pilot: true,
      }).id;
      databaseBuilder.factory.buildSession({
        version: 2,
        certificationCenterId: v2CertificationCenterId,
      }).id;
      await databaseBuilder.commit();

      // when
      const sessionIds = await configurationRepositories.sessionsRepository.findV2SessionIdsWithNoCourses();

      expect(sessionIds).to.deep.equal([inactiveSessionId]);
    });
  });
});
