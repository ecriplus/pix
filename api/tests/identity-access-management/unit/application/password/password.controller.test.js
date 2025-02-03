import { passwordController } from '../../../../../src/identity-access-management/application/password/password.controller.js';
import { usecases } from '../../../../../src/identity-access-management/domain/usecases/index.js';
import { expect, hFake, sinon } from '../../../../test-helper.js';

describe('Unit | Identity Access Management | Application | Controller | password', function () {
  describe('#checkResetDemand', function () {
    const email = 'user@example.net';
    const temporaryKey = 'ABCDEF123';

    const request = {
      params: { temporaryKey },
    };
    let dependencies;

    beforeEach(function () {
      sinon.stub(usecases, 'getUserByResetPasswordDemand');
      const userSerializerStub = {
        serialize: sinon.stub(),
      };
      dependencies = {
        userSerializer: userSerializerStub,
      };
      usecases.getUserByResetPasswordDemand.resolves({ email });
    });

    it('returns serialized user', async function () {
      // when
      await passwordController.checkResetDemand(request, hFake, dependencies);

      // then
      expect(usecases.getUserByResetPasswordDemand).to.have.been.calledWithExactly({ temporaryKey });
      expect(dependencies.userSerializer.serialize).to.have.been.calledWithExactly({ email });
    });
  });

  describe('#createResetPasswordDemand', function () {
    const email = 'user@example.net';
    const locale = 'fr';
    const temporaryKey = 'ABCDEF123';
    const request = {
      headers: {
        'accept-language': locale,
      },
      payload: { email },
    };
    const resetPasswordDemand = {
      id: 1,
      email,
      temporaryKey,
    };

    beforeEach(function () {
      sinon.stub(usecases, 'createResetPasswordDemand');
      usecases.createResetPasswordDemand.resolves(resetPasswordDemand);
    });

    context('when all went well', function () {
      it('replies with serialized reset password demand', async function () {
        // when
        const response = await passwordController.createResetPasswordDemand(request, hFake);

        // then
        expect(response.statusCode).to.equal(201);
        expect(usecases.createResetPasswordDemand).to.have.been.calledWithExactly({
          email,
          locale,
        });
        expect(response.source).to.deep.equal({
          data: {
            attributes: {
              email: 'user@example.net',
            },
            id: '1',
            type: 'password-reset-demands',
          },
        });
      });
    });
  });

  describe('#updateExpiredPassword', function () {
    it('returns 201 http status code', async function () {
      // given
      const request = {
        payload: {
          data: {
            attributes: {
              'password-reset-token': 'PASSWORD_RESET_TOKEN',
              'new-password': 'Password123',
            },
          },
        },
      };
      sinon.stub(usecases, 'updateExpiredPassword');
      usecases.updateExpiredPassword
        .withArgs({
          passwordResetToken: 'PASSWORD_RESET_TOKEN',
          newPassword: 'Password123',
        })
        .resolves('beth.rave1221');

      // when
      const response = await passwordController.updateExpiredPassword(request, hFake);

      // then
      expect(response.statusCode).to.equal(201);
      expect(response.source).to.deep.equal({
        data: {
          type: 'reset-expired-password-demands',
          attributes: {
            login: 'beth.rave1221',
          },
        },
      });
    });
  });
});
