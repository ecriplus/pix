const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');

const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');
const User = require('../../../../lib/domain/models/User');

const { UnexpectedCnavStateError, UnexpectedUserAccountError } = require('../../../../lib/domain/errors');
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');
const logger = require('../../../../lib/infrastructure/logger');

const authenticateCnavUser = require('../../../../lib/domain/usecases/authenticate-cnav-user');

describe('Unit | UseCase | authenticate-cnav-user', function () {
  let cnavAuthenticationService;
  let authenticationSessionService;
  let authenticationMethodRepository;
  let userRepository;

  let clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers(Date.now());

    cnavAuthenticationService = {
      exchangeCodeForTokens: sinon.stub(),
      getUserInfo: sinon.stub(),
      createAccessToken: sinon.stub().returns(),
    };

    authenticationMethodRepository = {
      create: sinon.stub().resolves(),
      findOneByUserIdAndIdentityProvider: sinon.stub(),
    };

    authenticationSessionService = {
      save: sinon.stub(),
    };

    userRepository = {
      findByCnavExternalIdentifier: sinon.stub().resolves({}),
      updateLastLoggedAt: sinon.stub(),
    };

    const domainTransaction = Symbol();
    DomainTransaction.execute = (lambda) => {
      return lambda(domainTransaction);
    };
  });

  afterEach(function () {
    clock.restore();
  });

  context('When the request state does not match the response state', function () {
    it('should throw an UnexpectedCnavStateError', async function () {
      // given
      const stateSent = 'stateSent';
      const stateReceived = 'stateReceived';
      sinon.stub(logger, 'error');

      // when
      const error = await catchErr(authenticateCnavUser)({
        authenticatedUserId: 1,
        clientId: 'clientId',
        code: 'code',
        redirectUri: 'redirectUri',
        stateReceived,
        stateSent,
        cnavAuthenticationService,
        authenticationMethodRepository,
        authenticationSessionService,
        userRepository,
      });

      // then
      expect(error).to.be.an.instanceOf(UnexpectedCnavStateError);
      expect(logger.error).to.have.been.calledWith(
        `State sent ${stateSent} did not match the state received ${stateReceived}`
      );
    });
  });

  context('When user has an account', function () {
    it('should call authenticate cnav user with code and redirectUri parameters', async function () {
      // given
      _fakeCnavAPI({ cnavAuthenticationService });
      cnavAuthenticationService.createAccessToken.returns('access-token');

      // when
      await authenticateCnavUser({
        authenticatedUserId: 1,
        clientId: 'clientId',
        code: 'code',
        redirectUri: 'redirectUri',
        stateReceived: 'state',
        stateSent: 'state',
        cnavAuthenticationService,
        authenticationMethodRepository,
        authenticationSessionService,
        userRepository,
      });

      // then
      expect(cnavAuthenticationService.exchangeCodeForTokens).to.have.been.calledWith({
        code: 'code',
        redirectUri: 'redirectUri',
      });
    });

    it('should call get cnav user info with id token parameter', async function () {
      // given
      _fakeCnavAPI({ cnavAuthenticationService });
      cnavAuthenticationService.createAccessToken.returns('access-token');

      // when
      await authenticateCnavUser({
        authenticatedUserId: 1,
        clientId: 'clientId',
        code: 'code',
        redirectUri: 'redirectUri',
        stateReceived: 'state',
        stateSent: 'state',
        cnavAuthenticationService,
        authenticationMethodRepository,
        authenticationSessionService,
        userRepository,
      });

      // then
      expect(cnavAuthenticationService.getUserInfo).to.have.been.calledWith('idToken');
    });

    it('should call cnavAuthenticationService createAccessToken function with user id', async function () {
      // given
      const user = new User({ id: 1, firstName: 'Tuck', lastName: 'Morris' });
      user.externalIdentityId = '094b83ac-2e20-4aa8-b438-0bc91748e4a6';
      cnavAuthenticationService.createAccessToken.returns('access-token');

      _fakeCnavAPI({ cnavAuthenticationService });
      userRepository.findByCnavExternalIdentifier.resolves({ id: 1 });

      // when
      await authenticateCnavUser({
        authenticatedUserId: 1,
        clientId: 'clientId',
        code: 'code',
        redirectUri: 'redirectUri',
        stateReceived: 'state',
        stateSent: 'state',
        cnavAuthenticationService,
        authenticationMethodRepository,
        authenticationSessionService,
        userRepository,
      });

      // then
      expect(cnavAuthenticationService.createAccessToken).to.have.been.calledWith(1);
    });

    it('should return accessToken', async function () {
      // given
      _fakeCnavAPI({ cnavAuthenticationService });
      const authenticatedUserId = 1;
      cnavAuthenticationService.createAccessToken.withArgs(authenticatedUserId).returns('access-token');

      // when
      const result = await authenticateCnavUser({
        authenticatedUserId,
        clientId: 'clientId',
        code: 'code',
        redirectUri: 'redirectUri',
        stateReceived: 'state',
        stateSent: 'state',
        cnavAuthenticationService,
        authenticationMethodRepository,
        authenticationSessionService,
        userRepository,
      });

      // then
      const expectedResult = { pixAccessToken: 'access-token' };
      expect(result).to.deep.equal(expectedResult);
    });

    it('should save last logged at date', async function () {
      // given
      _fakeCnavAPI({ cnavAuthenticationService });
      cnavAuthenticationService.createAccessToken.returns('access-token');

      // when
      await authenticateCnavUser({
        authenticatedUserId: 1,
        clientId: 'clientId',
        code: 'code',
        redirectUri: 'redirectUri',
        stateReceived: 'state',
        stateSent: 'state',
        cnavAuthenticationService,
        authenticationMethodRepository,
        authenticationSessionService,
        userRepository,
      });

      // then
      expect(userRepository.updateLastLoggedAt).to.have.been.calledWith({ userId: 1 });
    });

    context('When user has an cnav authentication method', function () {
      it('should save last logged at date', async function () {
        // given
        userRepository.findByCnavExternalIdentifier.resolves({ id: 123 });
        _fakeCnavAPI({ cnavAuthenticationService });
        cnavAuthenticationService.createAccessToken.returns('access-token');

        // when
        await authenticateCnavUser({
          authenticatedUserId: undefined,
          clientId: 'clientId',
          code: 'code',
          redirectUri: 'redirectUri',
          stateReceived: 'state',
          stateSent: 'state',
          cnavAuthenticationService,
          authenticationMethodRepository,
          authenticationSessionService,
          userRepository,
        });

        // then
        expect(userRepository.updateLastLoggedAt).to.have.been.calledWith({ userId: 123 });
      });
    });

    context('When user is connected with Pix authentication method', function () {
      context('When the user does not have a cnav authentication method', function () {
        it('should call authentication method repository create function with cnav authentication method in domain transaction', async function () {
          // given
          _fakeCnavAPI({ cnavAuthenticationService });
          userRepository.findByCnavExternalIdentifier.resolves(null);
          cnavAuthenticationService.createAccessToken.returns('access-token');

          // when
          await authenticateCnavUser({
            authenticatedUserId: 1,
            clientId: 'clientId',
            code: 'code',
            redirectUri: 'redirectUri',
            stateReceived: 'state',
            stateSent: 'state',
            cnavAuthenticationService,
            authenticationMethodRepository,
            authenticationSessionService,
            userRepository,
          });

          // then
          const expectedAuthenticationMethod = new AuthenticationMethod({
            identityProvider: AuthenticationMethod.identityProviders.CNAV,
            externalIdentifier: '094b83ac-2e20-4aa8-b438-0bc91748e4a6',
            userId: 1,
          });
          expect(authenticationMethodRepository.create).to.have.been.calledWith({
            authenticationMethod: expectedAuthenticationMethod,
          });
        });
      });

      context('When the user does have a cnav authentication method', function () {
        it('should throw an UnexpectedUserAccountError error if the external identifier does not match the one in the cnav id token', async function () {
          // given
          _fakeCnavAPI({ cnavAuthenticationService });

          authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(
            domainBuilder.buildAuthenticationMethod.withCnavAsIdentityProvider({
              externalIdentifier: 'other_external_identifier',
            })
          );

          // when
          const error = await catchErr(authenticateCnavUser)({
            authenticatedUserId: 1,
            clientId: 'clientId',
            code: 'code',
            redirectUri: 'redirectUri',
            stateReceived: 'state',
            stateSent: 'state',
            cnavAuthenticationService,
            authenticationMethodRepository,
            authenticationSessionService,
            userRepository,
          });

          // then
          expect(error).to.be.instanceOf(UnexpectedUserAccountError);
        });
      });
    });
  });

  context('When user has no account', function () {
    it('should call CnavTokens repository save method', async function () {
      // given
      const idToken = _fakeCnavAPI({ cnavAuthenticationService });
      const key = 'aaa-bbb-ccc';
      authenticationSessionService.save.resolves(key);
      userRepository.findByCnavExternalIdentifier.resolves(null);

      // when
      await authenticateCnavUser({
        authenticatedUserId: undefined,
        clientId: 'clientId',
        code: 'code',
        redirectUri: 'redirectUri',
        stateReceived: 'state',
        stateSent: 'state',
        cnavAuthenticationService,
        authenticationMethodRepository,
        authenticationSessionService,
        userRepository,
      });

      // then
      expect(authenticationSessionService.save).to.have.been.calledWith(idToken);
    });

    it('should return an authenticationKey', async function () {
      // given
      const key = 'aaa-bbb-ccc';
      _fakeCnavAPI({ cnavAuthenticationService });
      authenticationSessionService.save.resolves(key);
      userRepository.findByCnavExternalIdentifier.resolves(null);

      // when
      const result = await authenticateCnavUser({
        authenticatedUserId: undefined,
        clientId: 'clientId',
        code: 'code',
        redirectUri: 'redirectUri',
        stateReceived: 'state',
        stateSent: 'state',
        cnavAuthenticationService,
        authenticationMethodRepository,
        authenticationSessionService,
        userRepository,
      });

      // then
      expect(result.authenticationKey).to.equal(key);
    });
  });
});

function _fakeCnavAPI({ cnavAuthenticationService }) {
  const idToken = 'idToken';
  const userInfo = {
    family_name: 'Morris',
    given_name: 'Tuck',
    externalIdentityId: '094b83ac-2e20-4aa8-b438-0bc91748e4a6',
  };

  cnavAuthenticationService.exchangeCodeForTokens.resolves(idToken);
  cnavAuthenticationService.getUserInfo.resolves(userInfo);

  return idToken;
}
