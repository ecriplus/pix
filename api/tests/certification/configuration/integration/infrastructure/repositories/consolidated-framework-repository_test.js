import * as consolidatedFrameworkRepository from '../../../../../../src/certification/configuration/infrastructure/repositories/consolidated-framework-repository.js';
import { databaseBuilder, expect, knex } from '../../../../../test-helper.js';

describe('Certification | Configuration | Integration | Repository | consolidated-framework', function () {
  describe('#create', function () {
    it('should create a consolidated framework for a given certification key', async function () {
      // given
      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification();

      const challenge1 = databaseBuilder.factory.learningContent.buildChallenge({
        id: 'challenge1',
        alpha: 1.33,
        delta: 2.2,
      });
      const challenge2 = databaseBuilder.factory.learningContent.buildChallenge({
        id: 'challenge2',
        alpha: 4.2,
        delta: -2,
      });
      await databaseBuilder.commit();

      // when
      await consolidatedFrameworkRepository.create({
        complementaryCertificationKey: complementaryCertification.key,
        challenges: [challenge1, challenge2],
        version: '1234',
      });

      // then
      const consolidatedFrameworkInDB = await knex('certification-frameworks-challenges').select(
        'complementaryCertificationKey',
        'challengeId',
        'discriminant',
        'difficulty',
        'createdAt',
        'version',
      );

      expect(consolidatedFrameworkInDB).to.have.lengthOf(2);
      expect(consolidatedFrameworkInDB[0].discriminant).to.equal(null);
      expect(consolidatedFrameworkInDB[0].difficulty).to.equal(null);
      expect(consolidatedFrameworkInDB[0].challengeId).to.equal(challenge1.id);
      expect(consolidatedFrameworkInDB[1].challengeId).to.equal(challenge2.id);
      expect(consolidatedFrameworkInDB[0].complementaryCertificationKey).to.equal(
        consolidatedFrameworkInDB[1].complementaryCertificationKey,
      );
      expect(consolidatedFrameworkInDB[0].version).to.equal(consolidatedFrameworkInDB[1].version);
    });
  });

  describe('#getCurrentFrameworkByComplementaryCertificationKey', function () {
    it('should get the current complementary certification framework', async function () {
      // given
      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification();

      const olderTube = databaseBuilder.factory.learningContent.buildTube({ id: 'olderTube' });
      const olderSkill = databaseBuilder.factory.learningContent.buildSkill({ tubeId: olderTube.id });
      const olderChallenge = databaseBuilder.factory.learningContent.buildChallenge({ skillId: olderSkill.id });

      const expectedTube1 = databaseBuilder.factory.learningContent.buildTube({ id: 'expectedTube1' });
      const expectedTube2 = databaseBuilder.factory.learningContent.buildTube({ id: 'expectedTube2' });
      const expectedSkill1 = databaseBuilder.factory.learningContent.buildSkill({
        id: 'skillId1',
        tubeId: expectedTube1.id,
      });
      const expectedSkill2 = databaseBuilder.factory.learningContent.buildSkill({
        id: 'skillId2',
        tubeId: expectedTube2.id,
      });

      const expectedChallenge1 = databaseBuilder.factory.learningContent.buildChallenge({
        id: 'challengeId1',
        skillId: expectedSkill1.id,
      });
      const expectedChallenge2 = databaseBuilder.factory.learningContent.buildChallenge({
        id: 'challengeId2',
        skillId: expectedSkill2.id,
      });

      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        complementaryCertificationKey: complementaryCertification.key,
        challengeId: olderChallenge.id,
        createdAt: new Date('2023-01-11'),
      });

      const currentDate = new Date('2025-10-21');
      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        complementaryCertificationKey: complementaryCertification.key,
        challengeId: expectedChallenge1.id,
        createdAt: currentDate,
      });
      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        complementaryCertificationKey: complementaryCertification.key,
        challengeId: expectedChallenge2.id,
        createdAt: currentDate,
      });
      await databaseBuilder.commit();

      // when
      const currentConsolidatedFramework =
        await consolidatedFrameworkRepository.getCurrentFrameworkByComplementaryCertificationKey({
          complementaryCertificationKey: complementaryCertification.key,
        });

      // then
      expect(currentConsolidatedFramework).to.deep.equal({
        complementaryCertificationKey: complementaryCertification.key,
        createdAt: currentDate,
        tubeIds: [expectedTube1.id, expectedTube2.id],
      });
    });
  });
});
