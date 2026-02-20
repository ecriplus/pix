import { Attestation } from '../../../../../src/profile/domain/models/Attestation.js';
import {
  getByKey,
  getDataByKey,
} from '../../../../../src/profile/infrastructure/repositories/attestation-repository.js';
import { databaseBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Profile | Integration | Infrastructure | Repository | Attestation', function () {
  describe('#getByKey', function () {
    it('should return attestation informations for given key', async function () {
      // given
      const templateName = 'Velodrome';
      const attestation = databaseBuilder.factory.buildAttestation({ templateName });
      await databaseBuilder.commit();

      // when
      const result = await getByKey({ attestationKey: attestation.key });

      // then

      expect(result).to.be.an.instanceof(Attestation);
      expect(result.templateName).to.equal(templateName);
    });

    it('should return null if no attestation exist for given key', async function () {
      // given&when
      const result = await getByKey({ attestationKey: 'BAD_KEY' });

      // then
      expect(result).to.be.null;
    });
  });

  describe('#getDataByKey', function () {
    it('should return attestation data as stream for given key', async function () {
      // given
      const templateName = 'Parc des Princes';
      const attestation = databaseBuilder.factory.buildAttestation({ templateName });
      await databaseBuilder.commit();

      const fakeData = Symbol('fakeData');
      const attestationStorage = { readFile: sinon.stub().resolves({ Body: fakeData }) };

      // when
      const result = await getDataByKey({ key: attestation.key, attestationStorage });

      // then

      expect(result).to.equal(fakeData);
    });

    it('should return null if no attestation exist for given key', async function () {
      // given&when
      const result = await getDataByKey({ key: 'BAD_KEY' });

      // then
      expect(result).to.be.null;
    });
  });
});
