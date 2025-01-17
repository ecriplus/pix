import { createResetPasswordDemandEmail } from '../../../../../src/identity-access-management/domain/emails/create-reset-password-demand.email.js';
import { createResetPasswordDemand } from '../../../../../src/identity-access-management/domain/usecases/create-reset-password-demand.usecase.js';
import { UserNotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, expect, sinon } from '../../../../test-helper.js';

describe('Unit | Identity Access Management | Domain | UseCase | create-reset-password-demand', function () {
  const email = 'user@example.net';
  const locale = 'fr';
  const temporaryKey = 'ABCDEF123';

  const resetPasswordDemand = {
    attributes: {
      id: 1,
      email,
      temporaryKey,
    },
  };

  let emailRepository;
  let resetPasswordService;
  let resetPasswordDemandRepository;
  let userRepository;

  beforeEach(function () {
    emailRepository = {
      sendEmail: sinon.stub(),
    };
    resetPasswordService = {
      generateTemporaryKey: sinon.stub(),
    };
    resetPasswordDemandRepository = {
      create: sinon.stub(),
    };
    userRepository = {
      isUserExistingByEmail: sinon.stub(),
    };

    userRepository.isUserExistingByEmail.resolves({ id: 1 });
    resetPasswordService.generateTemporaryKey.returns(temporaryKey);
    resetPasswordDemandRepository.create.resolves(resetPasswordDemand);
  });

  it('creates a password reset demand if user email exists', async function () {
    // given
    const expectedEmail = createResetPasswordDemandEmail({ email, locale, temporaryKey });

    // when
    const result = await createResetPasswordDemand({
      email,
      locale,
      emailRepository,
      resetPasswordService,
      resetPasswordDemandRepository,
      userRepository,
    });

    // then
    expect(result).to.deep.equal(resetPasswordDemand);

    expect(userRepository.isUserExistingByEmail).to.have.been.calledWithExactly(email);
    expect(resetPasswordService.generateTemporaryKey).to.have.been.calledOnce;
    expect(resetPasswordDemandRepository.create).to.have.been.calledWithExactly({ email, temporaryKey });
    expect(emailRepository.sendEmail).to.have.been.calledWithExactly(expectedEmail);
  });

  it('throws UserNotFoundError if user email does not exist', async function () {
    // given
    userRepository.isUserExistingByEmail.throws(new UserNotFoundError());

    // when
    const error = await catchErr(createResetPasswordDemand)({
      email,
      locale,
      emailRepository,
      resetPasswordService,
      resetPasswordDemandRepository,
      userRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotFoundError);
  });
});
