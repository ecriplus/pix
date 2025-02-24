import { PIX_ADMIN, PIX_CERTIF, PIX_ORGA } from '../../../../../src/authorization/domain/constants.js';
import { createWarningConnectionEmail } from '../../../../../src/identity-access-management/domain/emails/create-warning-connection.email.js';
import {
  MissingOrInvalidCredentialsError,
  UserShouldChangePasswordError,
} from '../../../../../src/identity-access-management/domain/errors.js';
import { RefreshToken } from '../../../../../src/identity-access-management/domain/models/RefreshToken.js';
import { User } from '../../../../../src/identity-access-management/domain/models/User.js';
import { authenticateUser } from '../../../../../src/identity-access-management/domain/usecases/authenticate-user.js';
import { UserNotFoundError } from '../../../../../src/shared/domain/errors.js';
import { ForbiddenAccess } from '../../../../../src/shared/domain/errors.js';
import { AdminMember } from '../../../../../src/shared/domain/models/AdminMember.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Unit | Identity Access Management | Domain | UseCases | authenticate-user', function () {
  let refreshTokenRepository;
  let tokenService;
  let userRepository;
  let userLoginRepository;
  let adminMemberRepository;
  let pixAuthenticationService;
  let emailRepository;
  let emailValidationDemandRepository;
  let clock;

  const userEmail = 'user@example.net';
  const password = 'Password1234';
  const localeFromCookie = 'fr';

  beforeEach(function () {
    clock = sinon.useFakeTimers({
      now: new Date('2025-01-01'),
      toFake: ['Date'],
    });
    refreshTokenRepository = {
      save: sinon.stub(),
    };
    tokenService = {
      createAccessTokenFromUser: sinon.stub(),
    };
    userRepository = {
      getByUsernameOrEmailWithRoles: sinon.stub(),
      update: sinon.stub(),
    };
    userLoginRepository = {
      updateLastLoggedAt: sinon.stub(),
      findByUserId: sinon.stub(),
    };
    adminMemberRepository = {
      get: sinon.stub(),
    };
    pixAuthenticationService = {
      getUserByUsernameAndPassword: sinon.stub(),
    };
    emailValidationDemandRepository = { save: sinon.stub() };
    emailRepository = { sendEmailAsync: sinon.stub() };
  });

  afterEach(async function () {
    clock.restore();
  });

  context('check acces by pix scope', function () {
    context('when scope is pix-orga', function () {
      it('should rejects an error when user is not linked to any organizations', async function () {
        // given
        const scope = PIX_ORGA.SCOPE;
        const user = new User({ email: userEmail, memberships: [] });
        const audience = 'https://orga.pix.fr';
        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);

        // when
        const error = await catchErr(authenticateUser)({
          username: userEmail,
          password,
          scope,
          pixAuthenticationService,
          userRepository,
          userLoginRepository,
          refreshTokenRepository,
          audience,
        });

        // then
        expect(error).to.be.an.instanceOf(ForbiddenAccess);
        expect(error.message).to.be.equal(PIX_ORGA.NOT_LINKED_ORGANIZATION_MSG);
      });
    });

    context('when scope is pix-admin', function () {
      it('should throw an error when user has no role and is therefore not an admin member', async function () {
        // given
        const scope = PIX_ADMIN.SCOPE;
        const user = new User({ email: userEmail });
        const audience = 'https://admin.pix.fr';

        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
        adminMemberRepository.get.withArgs({ userId: user.id }).resolves();

        // when
        const error = await catchErr(authenticateUser)({
          username: userEmail,
          password,
          scope,
          pixAuthenticationService,
          userRepository,
          userLoginRepository,
          adminMemberRepository,
          refreshTokenRepository,
          audience,
        });

        // then
        expect(error).to.be.an.instanceOf(ForbiddenAccess);
        expect(error.message).to.be.equal(PIX_ADMIN.NOT_ALLOWED_MSG);
      });

      it('should throw an error when user has a role but admin membership is disabled', async function () {
        // given
        const scope = PIX_ADMIN.SCOPE;
        const user = new User({ email: userEmail });
        const audience = 'https://admin.pix.fr';
        const adminMember = new AdminMember({
          id: 567,
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: 'CERTIF',
          createdAt: undefined,
          updatedAt: undefined,
          disabledAt: new Date(),
        });
        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
        adminMemberRepository.get.withArgs({ userId: user.id }).resolves(adminMember);

        // when
        const error = await catchErr(authenticateUser)({
          username: userEmail,
          password,
          scope,
          pixAuthenticationService,
          userRepository,
          userLoginRepository,
          adminMemberRepository,
          refreshTokenRepository,
          audience,
        });

        // then
        expect(error).to.be.an.instanceOf(ForbiddenAccess);
        expect(error.message).to.be.equal(PIX_ADMIN.NOT_ALLOWED_MSG);
      });

      it('should resolve a valid JWT access token when admin member is not disabled and has a valid role', async function () {
        // given
        const scope = PIX_ADMIN.SCOPE;
        const source = 'pix';
        const user = new User({ id: 123, email: userEmail });
        const audience = 'https://admin.pix.fr';
        const adminMember = new AdminMember({
          id: 567,
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: 'CERTIF',
          createdAt: undefined,
          updatedAt: undefined,
          disabledAt: null,
        });

        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
        adminMemberRepository.get.withArgs({ userId: user.id }).resolves(adminMember);

        const refreshToken = { value: 'jwt.refresh.token', userId: user.id, scope, audience };
        sinon.stub(RefreshToken, 'generate').returns(refreshToken);

        const accessToken = '';
        const expirationDelaySeconds = '';

        tokenService.createAccessTokenFromUser
          .withArgs({ userId: user.id, source, audience })
          .resolves({ accessToken, expirationDelaySeconds });

        // when
        const result = await authenticateUser({
          username: userEmail,
          password,
          scope,
          source,
          pixAuthenticationService,
          userRepository,
          userLoginRepository,
          adminMemberRepository,
          refreshTokenRepository,
          tokenService,
          audience,
        });

        // then
        expect(pixAuthenticationService.getUserByUsernameAndPassword).to.have.been.calledWithExactly({
          username: userEmail,
          password,
          userRepository,
        });
        expect(result).to.deep.equal({ accessToken, refreshToken: refreshToken.value, expirationDelaySeconds });
      });
    });

    context('when scope is pix-certif', function () {
      context('when user is not linked to any certification centers', function () {
        it('should resolves a valid JWT access token when feature toggle is enabled', async function () {
          // given
          const scope = PIX_CERTIF.SCOPE;
          const accessToken = 'jwt.access.token';
          const expirationDelaySeconds = 1;
          const source = 'pix';
          const audience = 'https://certif.pix.fr';

          const user = domainBuilder.buildUser({
            email: userEmail,
            certificationCenterMemberships: [Symbol('certificationCenterMembership')],
          });

          pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);

          const refreshToken = { value: 'jwt.refresh.token', userId: '456', scope, audience };
          sinon.stub(RefreshToken, 'generate').returns(refreshToken);

          tokenService.createAccessTokenFromUser
            .withArgs({ userId: user.id, source, audience })
            .resolves({ accessToken, expirationDelaySeconds });

          // when
          await authenticateUser({
            username: userEmail,
            password,
            scope,
            source,
            pixAuthenticationService,
            tokenService,
            refreshTokenRepository,
            userRepository,
            userLoginRepository,
            audience,
          });

          // then
          expect(pixAuthenticationService.getUserByUsernameAndPassword).to.have.been.calledWithExactly({
            username: userEmail,
            password,
            userRepository,
          });
        });
      });
    });
  });

  it('should resolves a valid JWT access token when authentication succeeded', async function () {
    // given
    const accessToken = 'jwt.access.token';
    const source = 'pix';
    const scope = 'mon-pix';
    const expirationDelaySeconds = 1;
    const user = domainBuilder.buildUser({ email: userEmail });
    const audience = 'https://certif.pix.fr';

    pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);

    const refreshToken = { value: 'jwt.refresh.token', userId: '456', scope, audience };
    sinon.stub(RefreshToken, 'generate').returns(refreshToken);

    tokenService.createAccessTokenFromUser
      .withArgs({ userId: user.id, source, audience })
      .resolves({ accessToken, expirationDelaySeconds });

    // when
    const result = await authenticateUser({
      username: userEmail,
      password,
      source,
      scope,
      pixAuthenticationService,
      refreshTokenRepository,
      tokenService,
      userRepository,
      userLoginRepository,
      audience,
    });

    // then
    expect(pixAuthenticationService.getUserByUsernameAndPassword).to.have.been.calledWithExactly({
      username: userEmail,
      password,
      userRepository,
    });
    expect(result).to.deep.equal({ accessToken, refreshToken: refreshToken.value, expirationDelaySeconds });
  });

  it('should save the last date of login when authentication succeeded', async function () {
    // given
    const accessToken = 'jwt.access.token';
    const source = 'pix';
    const scope = 'mon-pix';
    const expirationDelaySeconds = 1;
    const audience = 'https://certif.pix.fr';

    const user = domainBuilder.buildUser({ email: userEmail });

    pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
    tokenService.createAccessTokenFromUser
      .withArgs({ userId: user.id, source, audience })
      .resolves({ accessToken, expirationDelaySeconds });

    // when
    await authenticateUser({
      username: userEmail,
      password,
      source,
      scope,
      pixAuthenticationService,
      refreshTokenRepository,
      tokenService,
      userRepository,
      userLoginRepository,
      audience,
    });

    // then
    expect(userLoginRepository.updateLastLoggedAt).to.have.been.calledWithExactly({ userId: user.id });
  });

  it('should rejects an error when given username (email) does not match an existing one', async function () {
    // given
    const unknownUserEmail = 'unknown_user_email@example.net';
    pixAuthenticationService.getUserByUsernameAndPassword.rejects(new UserNotFoundError());
    const audience = 'https://certif.pix.fr';

    // when
    const error = await catchErr(authenticateUser)({
      username: unknownUserEmail,
      password,
      userRepository,
      userLoginRepository,
      refreshTokenRepository,
      pixAuthenticationService,
      audience,
    });

    // then
    expect(error).to.be.an.instanceOf(MissingOrInvalidCredentialsError);
  });

  it('should rejects an error when given password does not match the found user’s one', async function () {
    // given
    pixAuthenticationService.getUserByUsernameAndPassword.rejects(new MissingOrInvalidCredentialsError());
    const audience = 'https://certif.pix.fr';

    // when
    const error = await catchErr(authenticateUser)({
      username: userEmail,
      password,
      userRepository,
      userLoginRepository,
      refreshTokenRepository,
      pixAuthenticationService,
      audience,
    });

    // then
    expect(error).to.be.an.instanceOf(MissingOrInvalidCredentialsError);
  });

  context('when user has connected after a long period since last connection date', function () {
    context('when user has an email', function () {
      it('should send a connection warning email', async function () {
        // given
        const accessToken = 'jwt.access.token';
        const source = 'pix';
        const scope = 'mon-pix';
        const expirationDelaySeconds = 1;
        const audience = 'https://certif.pix.fr';

        const user = domainBuilder.buildUser({ email: userEmail });
        const userLogins = domainBuilder.identityAccessManagement.buildUserLogin({
          id: 1,
          userId: user.id,
          lastLoggedAt: '2020-01-01',
        });
        const validationToken = 'token';
        const expectedEmail = createWarningConnectionEmail({
          email: user.email,
          firstName: user.firstName,
          locale: user.locale,
          validationToken,
        });

        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
        tokenService.createAccessTokenFromUser
          .withArgs({ userId: user.id, source, audience })
          .resolves({ accessToken, expirationDelaySeconds });
        emailValidationDemandRepository.save.withArgs(user.id).resolves(validationToken);
        userLoginRepository.findByUserId.resolves(userLogins);

        await authenticateUser({
          username: userEmail,
          password,
          source,
          scope,
          pixAuthenticationService,
          refreshTokenRepository,
          tokenService,
          userRepository,
          userLoginRepository,
          emailRepository,
          emailValidationDemandRepository,
          audience,
        });

        // then
        expect(emailRepository.sendEmailAsync).to.have.been.calledWithExactly(expectedEmail);
      });
    });
    context('when user has no email', function () {
      it('should not send a connection warning email', async function () {
        // given
        const accessToken = 'jwt.access.token';
        const source = 'pix';
        const scope = 'mon-pix';
        const expirationDelaySeconds = 1;
        const audience = 'https://certif.pix.fr';
        const username = 'lorie.amie';
        const user = domainBuilder.buildUser({ username: username });

        user.email = null;

        const userLogins = domainBuilder.identityAccessManagement.buildUserLogin({
          id: 1,
          userId: user.id,
          lastLoggedAt: '2020-01-01',
        });

        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
        tokenService.createAccessTokenFromUser
          .withArgs({ userId: user.id, source, audience })
          .resolves({ accessToken, expirationDelaySeconds });

        userLoginRepository.findByUserId.resolves(userLogins);

        // when
        await authenticateUser({
          username: username,
          password,
          source,
          scope,
          pixAuthenticationService,
          refreshTokenRepository,
          tokenService,
          userRepository,
          userLoginRepository,
          emailRepository,
          audience,
        });

        // then
        expect(emailRepository.sendEmailAsync).to.have.not.been.called;
      });
    });
  });

  context('when user has connected before the connection warning period', function () {
    it('should not send a connection warning email', async function () {
      // given
      const accessToken = 'jwt.access.token';
      const source = 'pix';
      const scope = 'mon-pix';
      const expirationDelaySeconds = 1;
      const audience = 'https://certif.pix.fr';

      const user = domainBuilder.buildUser({ email: userEmail });
      const userLogins = domainBuilder.identityAccessManagement.buildUserLogin({
        id: 1,
        userId: user.id,
        lastLoggedAt: '2024-12-01',
      });

      pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
      tokenService.createAccessTokenFromUser
        .withArgs({ userId: user.id, source, audience })
        .resolves({ accessToken, expirationDelaySeconds });

      userLoginRepository.findByUserId.resolves(userLogins);

      // when
      await authenticateUser({
        username: userEmail,
        password,
        source,
        scope,
        pixAuthenticationService,
        refreshTokenRepository,
        tokenService,
        userRepository,
        userLoginRepository,
        emailRepository,
        audience,
      });

      // then
      expect(emailRepository.sendEmailAsync).not.to.have.been.called;
    });
  });

  context('when user should change password', function () {
    it('should throw UserShouldChangePasswordError', async function () {
      // given
      const tokenService = { createPasswordResetToken: sinon.stub() };
      const audience = 'https://certif.pix.fr';

      const user = domainBuilder.buildUser({ username: 'jean.neymar2008' });
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndRawPassword({
        userId: user.id,
        rawPassword: 'Password1234',
        shouldChangePassword: true,
      });
      user.authenticationMethods = [authenticationMethod];

      pixAuthenticationService.getUserByUsernameAndPassword
        .withArgs({
          username: 'jean.neymar2008',
          password: 'Password1234',
          userRepository,
        })
        .resolves(user);
      tokenService.createPasswordResetToken.withArgs(user.id).returns('RESET_PASSWORD_TOKEN');

      // when
      const error = await catchErr(authenticateUser)({
        username: 'jean.neymar2008',
        password: 'Password1234',
        userRepository,
        userLoginRepository,
        pixAuthenticationService,
        refreshTokenRepository,
        tokenService,
        audience,
      });

      // then
      expect(error).to.be.an.instanceOf(UserShouldChangePasswordError);
      expect(error.meta).to.equal('RESET_PASSWORD_TOKEN');
    });
  });

  context('check if locale is updated', function () {
    context('when user has a locale', function () {
      it('does not update the user locale', async function () {
        // given
        const accessToken = 'jwt.access.token';
        const source = 'pix';
        const expirationDelaySeconds = 1;
        const user = domainBuilder.buildUser({ email: userEmail, locale: 'fr-FR' });
        const audience = 'https://app.pix.fr';

        pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
        tokenService.createAccessTokenFromUser.resolves({ accessToken, expirationDelaySeconds });

        // when
        await authenticateUser({
          username: userEmail,
          password,
          source,
          localeFromCookie,
          pixAuthenticationService,
          refreshTokenRepository,
          tokenService,
          userRepository,
          userLoginRepository,
          audience,
        });

        // then
        expect(userRepository.update).not.to.have.been.called;
      });
    });

    context('when user does not have a locale', function () {
      context('when there is a locale cookie ', function () {
        it('updates the user locale with the formatted value', async function () {
          // given
          const accessToken = 'jwt.access.token';
          const source = 'pix';
          const scope = 'mon-pix';
          const expirationDelaySeconds = 1;
          const audience = 'https://app.pix.fr';
          const user = domainBuilder.buildUser({ email: userEmail, locale: null });
          const setLocaleIfNotAlreadySetStub = sinon.stub(user, 'setLocaleIfNotAlreadySet');

          pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
          tokenService.createAccessTokenFromUser.resolves({ accessToken, expirationDelaySeconds });

          // when
          await authenticateUser({
            username: userEmail,
            password,
            source,
            scope,
            localeFromCookie: 'localeFromCookie',
            pixAuthenticationService,
            tokenService,
            refreshTokenRepository,
            userRepository,
            userLoginRepository,
            audience,
          });

          // then
          expect(setLocaleIfNotAlreadySetStub).to.have.been.calledWithExactly('localeFromCookie');
        });
      });

      context('when there is no locale cookie', function () {
        it('does not update the user locale', async function () {
          // given
          const accessToken = 'jwt.access.token';
          const source = 'pix';
          const scope = 'mon-pix';
          const expirationDelaySeconds = 1;
          const audience = 'https://app.pix.fr';
          const user = domainBuilder.buildUser({ email: userEmail, locale: undefined });

          pixAuthenticationService.getUserByUsernameAndPassword.resolves(user);
          tokenService.createAccessTokenFromUser.resolves({ accessToken, expirationDelaySeconds });

          // when
          await authenticateUser({
            username: userEmail,
            password,
            source,
            scope,
            localeFromCookie: undefined,
            pixAuthenticationService,
            refreshTokenRepository,
            tokenService,
            userRepository,
            userLoginRepository,
            audience,
          });

          // then
          expect(userRepository.update).not.to.have.been.called;
        });
      });
    });
  });
});
