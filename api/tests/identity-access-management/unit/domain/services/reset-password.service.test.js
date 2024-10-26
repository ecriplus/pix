import jsonwebtoken from 'jsonwebtoken';

import { resetPasswordService } from '../../../../../src/identity-access-management/domain/services/reset-password.service.js';
import { config as settings } from '../../../../../src/shared/config.js';
import { cryptoService } from '../../../../../src/shared/domain/services/crypto-service.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Identity Access Management | Domain | Service | reset-password', function () {
  describe('#generateTemporaryKey', function () {
    let randomGeneratedString;

    beforeEach(function () {
      sinon.stub(jsonwebtoken, 'sign');
      randomGeneratedString = 'aaaaaa';
      sinon.stub(cryptoService, 'randomBytes').resolves(randomGeneratedString);
    });

    it('calls sign function from jwt', async function () {
      // given
      const signParams = {
        payload: { data: randomGeneratedString },
        secret: settings.temporaryKey.secret,
        expiration: { expiresIn: settings.temporaryKey.tokenLifespan },
      };

      // when
      await resetPasswordService.generateTemporaryKey();

      // then
      sinon.assert.calledOnce(jsonwebtoken.sign);
      sinon.assert.calledWith(jsonwebtoken.sign, signParams.payload, signParams.secret, signParams.expiration);
    });
  });

  describe('#invalidateOldResetPasswordDemandsByEmail', function () {
    let resetPasswordDemandRepository;

    beforeEach(function () {
      resetPasswordDemandRepository = {
        markAllAsUsedByEmail: sinon.stub(),
      };
    });

    it('calls reset password repository', function () {
      // given
      const userEmail = 'shi@fu.me';
      resetPasswordDemandRepository.markAllAsUsedByEmail.resolves();

      // when
      const promise = resetPasswordService.invalidateOldResetPasswordDemandsByEmail(
        userEmail,
        resetPasswordDemandRepository,
      );

      // then
      return promise.then(() => {
        sinon.assert.calledOnce(resetPasswordDemandRepository.markAllAsUsedByEmail);
        sinon.assert.calledWith(resetPasswordDemandRepository.markAllAsUsedByEmail, userEmail);
      });
    });
  });

  describe('#assertUserHasPasswordResetDemandInProgress', function () {
    const userEmail = 'shi@fu.me';
    let resetPasswordDemandRepository;

    beforeEach(function () {
      resetPasswordDemandRepository = {
        getByUserEmail: sinon.stub(),
      };
      resetPasswordDemandRepository.getByUserEmail.throws();
      resetPasswordDemandRepository.getByUserEmail.withArgs(userEmail, 'good-temporary-key').resolves();
      resetPasswordDemandRepository.getByUserEmail.withArgs(userEmail, 'bad-temporary-key').rejects();
    });

    context('when there is a matching password reset demand', function () {
      it('resolves', async function () {
        await resetPasswordService.assertUserHasPasswordResetDemandInProgress(
          userEmail,
          'good-temporary-key',
          resetPasswordDemandRepository,
        );
      });
    });

    context('when there is no matching password reset demand', function () {
      it('resolves', function () {
        const promise = resetPasswordService.assertUserHasPasswordResetDemandInProgress(
          userEmail,
          'bad-temporary-key',
          resetPasswordDemandRepository,
        );
        return expect(promise).to.be.rejected;
      });
    });
  });
});
