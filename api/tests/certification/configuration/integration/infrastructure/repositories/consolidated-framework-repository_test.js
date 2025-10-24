import * as consolidatedFrameworkRepository from '../../../../../../src/certification/configuration/infrastructure/repositories/consolidated-framework-repository.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { databaseBuilder, expect } from '../../../../../test-helper.js';

describe('Certification | Configuration | Integration | Repository | consolidated-framework', function () {
  describe('#getFrameworkHistory', function () {
    it('should return an empty array when there is no framework history', async function () {
      // given
      const complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT;

      // when
      const frameworkHistory = await consolidatedFrameworkRepository.getFrameworkHistory({
        complementaryCertificationKey,
      });

      // then
      expect(frameworkHistory).to.deep.equal([]);
    });

    it('should return the framework history', async function () {
      // given
      const version1 = '20240315000000';
      const version2 = '20250621000000';
      const version3 = '20260101000000';
      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        key: 'GOOD_KEY',
      });
      const otherComplementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        key: 'OTHER_KEY',
      });

      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        version: version1,
        challengeId: 'rec123',
        complementaryCertificationKey: complementaryCertification.key,
      });
      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        version: version2,
        challengeId: 'rec234',
        complementaryCertificationKey: complementaryCertification.key,
      });
      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        version: version2,
        challengeId: 'rec345',
        complementaryCertificationKey: otherComplementaryCertification.key,
      });
      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        version: version3,
        challengeId: 'rec456',
        complementaryCertificationKey: complementaryCertification.key,
      });
      await databaseBuilder.commit();

      // when
      const frameworkHistory = await consolidatedFrameworkRepository.getFrameworkHistory({
        complementaryCertificationKey: complementaryCertification.key,
      });

      // then
      expect(frameworkHistory).to.deep.equal([version3, version2, version1]);
    });
  });
});
