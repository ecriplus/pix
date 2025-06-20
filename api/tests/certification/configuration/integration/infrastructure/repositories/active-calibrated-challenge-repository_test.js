import * as activeCalibratedChallengeRepository from '../../../../../../src/certification/configuration/infrastructure/repositories/active-calibrated-challenge-repository.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { datamartBuilder, domainBuilder, expect } from '../../../../../test-helper.js';

describe('Certification | Configuration | Integration | Repository | active-calibrated-challenge', function () {
  describe('#findByComplementaryKeyAndCalibrationId', function () {
    it('should return empty array when empty challenges given', async function () {
      const calibrationId = '1234';
      const complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT;

      const calibratedChallenges = activeCalibratedChallengeRepository.findByComplementaryKeyAndCalibrationId({
        complementaryCertificationKey,
        calibrationId,
      });
      expect(calibratedChallenges).to.be.empty;
    });

    it('should return active calibrated challenges sorted by challengeId', async function () {
      //given
      const complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT;
      const calibrationId = 'calibration1234';

      const secondActiveCalibratedChallenge = datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec4567',
        calibrationId,
        scope: complementaryCertificationKey,
      });
      const firstActiveCalibratedChallenge = datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec1234',
        calibrationId,
        scope: complementaryCertificationKey,
      });
      // from CLEA scope
      datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec1234',
        calibrationId: 'cleaCalibrationId1234',
        scope: ComplementaryCertificationKeys.CLEA,
      });
      // with other calibrationId
      datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec4567',
        otherCalibrationId: 'otherCalibrationId1234',
        scope: complementaryCertificationKey,
      });

      const expectedActiveCalibratedChallenges = [
        domainBuilder.certification.configuration.buildActiveCalibratedChallenge({
          scope: firstActiveCalibratedChallenge.scope,
          discriminant: firstActiveCalibratedChallenge.alpha,
          difficulty: firstActiveCalibratedChallenge.delta,
          challengeId: firstActiveCalibratedChallenge.challenge_id,
        }),
        domainBuilder.certification.configuration.buildActiveCalibratedChallenge({
          scope: secondActiveCalibratedChallenge.scope,
          discriminant: secondActiveCalibratedChallenge.alpha,
          difficulty: secondActiveCalibratedChallenge.delta,
          challengeId: secondActiveCalibratedChallenge.challenge_id,
        }),
      ];

      await datamartBuilder.commit();

      //when
      const calibratedChallenges = await activeCalibratedChallengeRepository.findByComplementaryKeyAndCalibrationId({
        complementaryCertificationKey,
        calibrationId,
      });

      //then
      expect(calibratedChallenges).to.deep.equal(expectedActiveCalibratedChallenges);
    });
  });
});
