const { expect, sinon } = require('../../../../test-helper');

const poleEmploiAuthenticationService = require('../../../../../lib/domain/services/authentication/pole-emploi-authentication-service');
const UserToCreate = require('../../../../../lib/domain/models/UserToCreate');
const DomainTransaction = require('../../../../../lib/infrastructure/DomainTransaction');
const AuthenticationMethod = require('../../../../../lib/domain/models/AuthenticationMethod');
const moment = require('moment');

describe('Unit | Domain | Services | pole-emploi-authentication-service', function () {
  let userToCreateRepository, authenticationMethodRepository;
  let domainTransaction;
  let clock;
  const now = new Date('2021-01-02');

  beforeEach(function () {
    domainTransaction = Symbol();
    DomainTransaction.execute = (lambda) => {
      return lambda(domainTransaction);
    };

    clock = sinon.useFakeTimers(now);

    userToCreateRepository = {
      create: sinon.stub(),
    };
    authenticationMethodRepository = {
      create: sinon.stub(),
    };
  });

  afterEach(function () {
    clock.restore();
  });

  describe('#createUserAccount', function () {
    it('should return id token and user id', async function () {
      // given
      const externalIdentityId = '1233BBBC';
      const sessionContent = {
        accessToken: 'accessToken',
        idToken: 'idToken',
        expiresIn: 10,
        refreshToken: 'refreshToken',
      };
      const user = new UserToCreate({
        firstName: 'Adam',
        lastName: 'Troisjours',
      });
      const userId = 1;
      userToCreateRepository.create.withArgs({ user, domainTransaction }).resolves({ id: userId });

      const expectedAuthenticationMethod = new AuthenticationMethod({
        identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
        externalIdentifier: externalIdentityId,
        authenticationComplement: new AuthenticationMethod.PoleEmploiAuthenticationComplement({
          accessToken: sessionContent.accessToken,
          refreshToken: sessionContent.refreshToken,
          expiredDate: moment().add(sessionContent.expiresIn, 's').toDate(),
        }),
        userId,
      });

      // when
      const result = await poleEmploiAuthenticationService.createUserAccount({
        user,
        sessionContent,
        externalIdentityId,
        userToCreateRepository,
        authenticationMethodRepository,
      });

      // then
      expect(authenticationMethodRepository.create).to.have.been.calledWith({
        authenticationMethod: expectedAuthenticationMethod,
        domainTransaction,
      });
      expect(result).to.be.deep.equal({ idToken: sessionContent.idToken, userId });
    });
  });
});
