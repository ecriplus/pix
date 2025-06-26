import { userAdminController } from '../../../../../src/identity-access-management/application/user/user.admin.controller.js';
import { NON_OIDC_IDENTITY_PROVIDERS } from '../../../../../src/identity-access-management/domain/constants/identity-providers.js';
import { QUERY_TYPES } from '../../../../../src/identity-access-management/domain/constants/user-query.js';
import { User } from '../../../../../src/identity-access-management/domain/models/User.js';
import { usecases } from '../../../../../src/identity-access-management/domain/usecases/index.js';
import { DomainTransaction } from '../../../../../src/shared/domain/DomainTransaction.js';
import { UserNotAuthorizedToRemoveAuthenticationMethod } from '../../../../../src/shared/domain/errors.js';
import { catchErr, domainBuilder, expect, hFake, sinon } from '../../../../test-helper.js';

describe('Unit | Identity Access Management | Application | Controller | Admin | User', function () {
  describe('#findPaginatedFilteredUsers', function () {
    let dependencies;

    beforeEach(function () {
      sinon.stub(usecases, 'findPaginatedFilteredUsers');
      const userForAdminSerializer = { serialize: sinon.stub() };
      dependencies = {
        userForAdminSerializer,
      };
    });

    it('returns a list of JSON API users fetched from the data repository', async function () {
      // given
      const request = { query: {} };
      usecases.findPaginatedFilteredUsers.resolves({ models: {}, pagination: {} });
      dependencies.userForAdminSerializer.serialize.returns({ data: {}, meta: {} });

      // when
      await userAdminController.findPaginatedFilteredUsers(request, hFake, dependencies);

      // then
      expect(usecases.findPaginatedFilteredUsers).to.have.been.calledOnce;
      expect(dependencies.userForAdminSerializer.serialize).to.have.been.calledOnce;
    });

    it('returns a JSON API response with pagination information', async function () {
      // given
      const request = { query: {} };
      const expectedResults = [new User({ id: 1 }), new User({ id: 2 }), new User({ id: 3 })];
      const expectedPagination = { page: 2, pageSize: 25, itemsCount: 100, pagesCount: 4 };
      usecases.findPaginatedFilteredUsers.resolves({ models: expectedResults, pagination: expectedPagination });

      // when
      await userAdminController.findPaginatedFilteredUsers(request, hFake, dependencies);

      // then
      expect(dependencies.userForAdminSerializer.serialize).to.have.been.calledWithExactly(
        expectedResults,
        expectedPagination,
      );
    });

    it('allows to filter users by first name', async function () {
      // given
      const query = { filter: { firstName: 'Alexia' }, page: {}, queryType: QUERY_TYPES.CONTAINS };
      const request = { query };
      usecases.findPaginatedFilteredUsers.resolves({ models: {}, pagination: {} });

      // when
      await userAdminController.findPaginatedFilteredUsers(request, hFake, dependencies);

      // then
      expect(usecases.findPaginatedFilteredUsers).to.have.been.calledWithMatch(query);
    });

    it('allows to filter users by last name', async function () {
      // given
      const query = { filter: { lastName: 'Granjean' }, page: {}, queryType: QUERY_TYPES.CONTAINS };
      const request = { query };
      usecases.findPaginatedFilteredUsers.resolves({ models: {}, pagination: {} });

      // when
      await userAdminController.findPaginatedFilteredUsers(request, hFake, dependencies);

      // then
      expect(usecases.findPaginatedFilteredUsers).to.have.been.calledWithMatch(query);
    });

    it('allows to filter users by email', async function () {
      // given
      const query = { filter: { email: 'alexiagranjean' }, page: {}, queryType: QUERY_TYPES.CONTAINS };
      const request = { query };
      usecases.findPaginatedFilteredUsers.resolves({ models: {}, pagination: {} });

      // when
      await userAdminController.findPaginatedFilteredUsers(request, hFake, dependencies);

      // then
      expect(usecases.findPaginatedFilteredUsers).to.have.been.calledWithMatch(query);
    });

    it('allows to paginate on a given page and page size', async function () {
      // given
      const query = {
        filter: { email: 'alexiagranjean' },
        page: { number: 2, size: 25 },
        queryType: QUERY_TYPES.CONTAINS,
      };
      const request = { query };
      usecases.findPaginatedFilteredUsers.resolves({ models: {}, pagination: {} });

      // when
      await userAdminController.findPaginatedFilteredUsers(request, hFake, dependencies);

      // then
      expect(usecases.findPaginatedFilteredUsers).to.have.been.calledWithMatch(query);
    });
  });

  describe('#updateUserDetailsByAdmin', function () {
    const userId = 1132;
    const newEmail = 'partiel@update.com';
    let dependencies;

    beforeEach(function () {
      sinon.stub(usecases, 'updateUserDetailsByAdmin');
      const userDetailsForAdminSerializer = { serializeForUpdate: sinon.stub(), deserialize: sinon.stub() };
      dependencies = { userDetailsForAdminSerializer };
    });

    it('updates email, firstName, lastName', async function () {
      // given
      const userDetails = { email: newEmail, lastName: 'newLastName', firstName: 'newFirstName' };
      const payload = { data: { attributes: userDetails } };
      const request = {
        auth: { credentials: { userId: 'adminId' } },
        params: { id: userId },
        payload,
      };

      dependencies.userDetailsForAdminSerializer.deserialize.withArgs(payload).returns(userDetails);
      usecases.updateUserDetailsByAdmin.withArgs({ ...userDetails, updatedByAdminId: 'adminId' }).resolves();
      dependencies.userDetailsForAdminSerializer.serializeForUpdate.returns('updated');

      // when
      const response = await userAdminController.updateUserDetailsByAdmin(request, hFake, dependencies);

      // then
      expect(response).to.be.equal('updated');
    });

    it('updates email only', async function () {
      // given
      const payload = {
        data: {
          attributes: {
            email: newEmail,
          },
        },
      };
      const request = {
        auth: { credentials: { userId: 'adminId' } },
        params: {
          id: userId,
        },
        payload,
      };

      dependencies.userDetailsForAdminSerializer.deserialize.withArgs(payload).returns({ email: newEmail });
      usecases.updateUserDetailsByAdmin.resolves({ email: newEmail });
      dependencies.userDetailsForAdminSerializer.serializeForUpdate.returns(newEmail);

      // when
      const response = await userAdminController.updateUserDetailsByAdmin(request, hFake, dependencies);

      // then
      expect(response).to.be.equal(newEmail);
    });
  });

  describe('#getUserDetails', function () {
    let request;
    let dependencies;

    beforeEach(function () {
      request = { params: { id: 123 } };

      sinon.stub(usecases, 'getUserDetailsForAdmin');
      const userDetailsForAdminSerializer = { serialize: sinon.stub() };
      dependencies = { userDetailsForAdminSerializer };
    });

    it('gets the specified user', async function () {
      // given
      usecases.getUserDetailsForAdmin.withArgs({ userId: 123 }).resolves('userDetail');
      dependencies.userDetailsForAdminSerializer.serialize.withArgs('userDetail').returns('ok');

      // when
      const response = await userAdminController.getUserDetails(request, hFake, dependencies);

      // then
      expect(response).to.be.equal('ok');
    });
  });

  describe('#anonymizeUser', function () {
    let clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers({ now: new Date('2023-08-17'), toFake: ['Date'] });
    });

    afterEach(function () {
      clock.restore();
    });

    it('calls the anonymize user usecase', async function () {
      // given
      const userId = 1;
      const updatedByUserId = 2;
      const anonymizedUserSerialized = Symbol('anonymizedUserSerialized');
      const userDetailsForAdmin = Symbol('userDetailsForAdmin');
      const domainTransaction = {
        knexTransaction: Symbol('transaction'),
      };
      sinon.stub(usecases, 'anonymizeUser');
      sinon.stub(usecases, 'getUserDetailsForAdmin').resolves(userDetailsForAdmin);
      sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
        return callback(domainTransaction);
      });
      const userAnonymizedDetailsForAdminSerializer = { serialize: sinon.stub() };
      userAnonymizedDetailsForAdminSerializer.serialize.returns(anonymizedUserSerialized);

      // when
      const response = await userAdminController.anonymizeUser(
        {
          auth: { credentials: { userId: updatedByUserId } },
          params: { id: userId },
        },
        hFake,
        { userAnonymizedDetailsForAdminSerializer },
      );

      // then
      expect(DomainTransaction.execute).to.have.been.called;
      expect(usecases.anonymizeUser).to.have.been.calledWithExactly({ userId, updatedByUserId, domainTransaction });
      expect(usecases.getUserDetailsForAdmin).to.have.been.calledWithExactly({ userId });
      expect(userAnonymizedDetailsForAdminSerializer.serialize).to.have.been.calledWithExactly(userDetailsForAdmin);
      expect(response.statusCode).to.equal(200);
      expect(response.source).to.deep.equal(anonymizedUserSerialized);
    });
  });

  describe('#addPixAuthenticationMethod', function () {
    it('returns the user with the new pix authentication method', async function () {
      // given
      const email = '    USER@example.net    ';
      const user = domainBuilder.buildUser();
      const updatedUser = domainBuilder.buildUser({ ...user, email: 'user@example.net' });
      const updatedUserSerialized = Symbol('the user with a new email and serialized');
      sinon
        .stub(usecases, 'addPixAuthenticationMethod')
        .withArgs({ userId: user.id, email: 'user@example.net' })
        .resolves(updatedUser);
      const userDetailsForAdminSerializer = { serialize: sinon.stub() };
      userDetailsForAdminSerializer.serialize.withArgs(updatedUser).returns(updatedUserSerialized);

      // when
      const request = {
        auth: {
          credentials: {
            userId: user.id,
          },
        },
        params: {
          id: user.id,
        },
        payload: {
          data: {
            attributes: {
              email,
            },
          },
        },
      };
      const result = await userAdminController.addPixAuthenticationMethod(request, hFake, {
        userDetailsForAdminSerializer,
      });

      // then
      expect(result.source).to.be.equal(updatedUserSerialized);
    });
  });

  describe('#reassignAuthenticationMethod', function () {
    context('when the reassigned authentication method is gar', function () {
      it('updates GAR authentication method user id', async function () {
        // given
        const originUserId = domainBuilder.buildUser({ id: 1 }).id;
        const targetUserId = domainBuilder.buildUser({ id: 2 }).id;
        const authenticationMethodId = 123;

        sinon
          .stub(usecases, 'reassignAuthenticationMethodToAnotherUser')
          .withArgs({ originUserId, targetUserId, authenticationMethodId })
          .resolves();

        // when
        const request = {
          auth: {
            credentials: {
              userId: originUserId,
            },
          },
          params: {
            userId: originUserId,
            authenticationMethodId,
          },
          payload: {
            data: {
              attributes: {
                'user-id': targetUserId,
                'identity-provider': NON_OIDC_IDENTITY_PROVIDERS.GAR.code,
              },
            },
          },
        };
        await userAdminController.reassignAuthenticationMethod(request, hFake);

        // then
        expect(usecases.reassignAuthenticationMethodToAnotherUser).to.have.been.calledWithExactly({
          originUserId,
          targetUserId,
          authenticationMethodId,
        });
      });
    });
  });

  describe('#removeAuthenticationMethod', function () {
    let removeAuthenticationMethodStub, request;

    beforeEach(function () {
      removeAuthenticationMethodStub = sinon.stub(usecases, 'removeAuthenticationMethod');
      request = {
        params: { id: 123 },
        payload: {
          data: {
            attributes: {
              type: 'EMAIL',
            },
          },
        },
      };
    });

    context('Success cases', function () {
      it('returns a 204 HTTP status code', async function () {
        // given
        removeAuthenticationMethodStub.resolves();

        // when
        const response = await userAdminController.removeAuthenticationMethod(request, hFake);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });

    context('Error cases', function () {
      it('throws a UserNotAuthorizedToRemoveAuthenticationMethod when usecase has thrown this error', async function () {
        // given
        removeAuthenticationMethodStub.throws(new UserNotAuthorizedToRemoveAuthenticationMethod());
        // when
        const error = await catchErr(userAdminController.removeAuthenticationMethod)(request, hFake);

        // then
        expect(error).to.be.instanceOf(UserNotAuthorizedToRemoveAuthenticationMethod);
      });
    });
  });
});
