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

      const calibration = datamartBuilder.factory.buildCalibration({
        scope: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
        status: 'VALIDATED',
      });
      const cleaCalibration = datamartBuilder.factory.buildCalibration({
        scope: ComplementaryCertificationKeys.PIX_CLEA,
        status: 'VALIDATED',
      });
      const otherCalibration = datamartBuilder.factory.buildCalibration({
        scope: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
        status: 'VALIDATED',
      });
      const toValidateCalibration = datamartBuilder.factory.buildCalibration({
        scope: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
        status: 'TO_VALIDATE',
      });

      const secondActiveCalibratedChallenge = datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec4567',
        calibrationId: calibration.id,
      });
      const firstActiveCalibratedChallenge = datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec1234',
        calibrationId: calibration.id,
      });
      // from CLEA scope
      datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec1234',
        calibrationId: cleaCalibration.id,
      });
      // with other calibrationId
      datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec4567',
        calibrationId: otherCalibration.id,
      });
      // with calibration to validate
      datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec6789',
        calibrationId: toValidateCalibration.id,
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
        complementaryCertificationKey: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
        calibrationId: calibration.id,
      });

      //then
      expect(calibratedChallenges).to.deep.equal(expectedActiveCalibratedChallenges);
    });

    it("should return empty array when calibration id given doesn't match the given scope", async function () {
      const calibration = datamartBuilder.factory.buildCalibration({
        scope: ComplementaryCertificationKeys.PIX_PLUS_PRO_SANTE,
        status: 'VALIDATED',
      });

      datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec1234',
        calibrationId: calibration.id,
      });

      await datamartBuilder.commit();

      //when
      const calibratedChallenges = await activeCalibratedChallengeRepository.findByComplementaryKeyAndCalibrationId({
        complementaryCertificationKey: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
        calibrationId: calibration.id,
      });

      //then
      expect(calibratedChallenges).to.deep.equal([]);
    });

    it('should return empty array when calibration is to validate', async function () {
      //given
      const toValidateCalibration = datamartBuilder.factory.buildCalibration({
        scope: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
        status: 'TO_VALIDATE',
      });

      datamartBuilder.factory.buildActiveCalibratedChallenge({
        challengeId: 'rec6789',
        calibrationId: toValidateCalibration.id,
      });

      //when
      const calibratedChallenges = await activeCalibratedChallengeRepository.findByComplementaryKeyAndCalibrationId({
        complementaryCertificationKey: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
        calibrationId: toValidateCalibration.id,
      });

      //then
      expect(calibratedChallenges).to.deep.equal([]);
    });
  });
});
