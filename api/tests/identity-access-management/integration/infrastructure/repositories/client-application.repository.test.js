import { MissingClientApplicationScopesError } from '../../../../../src/identity-access-management/domain/errors.js';
import { clientApplicationRepository } from '../../../../../src/identity-access-management/infrastructure/repositories/client-application.repository.js';
import { databaseBuilder, domainBuilder, expect, knex } from '../../../../test-helper.js';

describe('Integration | Identity Access Management | Infrastructure | Repository | client-application', function () {
  let application1;
  let application2;

  beforeEach(async function () {
    application2 = databaseBuilder.factory.buildClientApplication({
      name: 'appli2',
      clientId: 'clientId-appli2',
      clientSecret: 'secret-app2',
      scopes: ['scope3', 'scope4', 'scope5'],
    });
    application1 = databaseBuilder.factory.buildClientApplication({
      name: 'appli1',
      clientId: 'clientId-appli1',
      clientSecret: 'secret-app1',
      scopes: ['scope1', 'scope2'],
    });

    await databaseBuilder.commit();
  });

  describe('#findByClientId', function () {
    context('when application clientId is not found', function () {
      it('should return undefined', async function () {
        // given
        const clientId = 'clientId-appli3';

        // when
        const application = await clientApplicationRepository.findByClientId(clientId);

        // then
        expect(application).to.be.undefined;
      });
    });

    context('when application clientId is found', function () {
      it('should return the application model', async function () {
        // given
        const clientId = 'clientId-appli2';

        // when
        const application = await clientApplicationRepository.findByClientId(clientId);

        // then
        expect(application).to.deepEqualInstance(domainBuilder.buildClientApplication(application2));
      });
    });
  });

  describe('#list', function () {
    it('should list all application ordered by name', async function () {
      // when
      const applications = await clientApplicationRepository.list();

      // then
      expect(applications).to.have.lengthOf(2);
      expect(applications[0]).to.deepEqualInstance(domainBuilder.buildClientApplication(application1));
      expect(applications[1]).to.deepEqualInstance(domainBuilder.buildClientApplication(application2));
    });
  });

  describe('#create', function () {
    it('should insert a new client application', async function () {
      // given
      const newApplication = {
        name: 'appli0',
        clientId: 'clientId-appli0',
        clientSecret: 'secret-app0',
        scopes: ['scope0'],
      };

      // when
      await clientApplicationRepository.create(newApplication);

      // then
      const applications = await knex.select().from('client_applications').orderBy('name');
      expect(applications).to.have.lengthOf(3);
      expect(applications[0]).to.deep.contain(newApplication);
      expect(applications[1]).to.deep.contain(application1);
      expect(applications[2]).to.deep.contain(application2);
    });
  });

  describe('#removeByClientId', function () {
    context('when application clientId is found', function () {
      it('should remove the corresponding application and return true', async function () {
        // given
        const clientId = application1.clientId;

        // when
        const removed = await clientApplicationRepository.removeByClientId(clientId);

        // then
        expect(removed).to.be.true;
        const applications = await knex.select().from('client_applications').orderBy('name');
        expect(applications).to.have.lengthOf(1);
        expect(applications[0]).to.deep.contain(application2);
      });
    });

    context('when application clientId is not found', function () {
      it('should return false', async function () {
        // given
        const clientId = 'not found';

        // when
        const removed = await clientApplicationRepository.removeByClientId(clientId);

        // then
        expect(removed).to.be.false;
        const applications = await knex.select().from('client_applications').orderBy('name');
        expect(applications).to.have.lengthOf(2);
        expect(applications[0]).to.deep.contain(application1);
        expect(applications[1]).to.deep.contain(application2);
      });
    });
  });

  describe('#addScopes', function () {
    context('when application client id is found', function () {
      it('should add missing scopes to the client application and return true', async function () {
        // given
        const clientId = application1.clientId;
        const newScopes = ['scope2', 'newScope1', 'newScope2', 'newScope1'];

        // when
        const updated = await clientApplicationRepository.addScopes(clientId, newScopes);

        // then
        expect(updated).to.be.true;
        const { scopes, createdAt, updatedAt } = await knex
          .select()
          .from('client_applications')
          .where({ clientId })
          .first();
        expect(updatedAt).to.be.greaterThan(createdAt);
        expect(scopes).to.have.lengthOf(4);
        expect(scopes).to.have.members(['scope1', 'scope2', 'newScope1', 'newScope2']);
      });
    });

    context('when application client id is not found', function () {
      it('should return false', async function () {
        // given
        const clientId = 'not found';
        const newScopes = ['scope2', 'newScope1', 'newScope2', 'newScope1'];

        // when
        const updated = await clientApplicationRepository.addScopes(clientId, newScopes);

        // then
        expect(updated).to.be.false;
      });
    });
  });

  describe('#removeScopes', function () {
    context('when application client id is found', function () {
      it('should remove scopes from the client application and return true', async function () {
        // given
        const clientId = application2.clientId;
        const scopesToRemove = ['scope3', 'scope5', 'scope3'];

        // when
        const updated = await clientApplicationRepository.removeScopes(clientId, scopesToRemove);

        // then
        expect(updated).to.be.true;
        const { scopes, createdAt, updatedAt } = await knex
          .select()
          .from('client_applications')
          .where({ clientId })
          .first();
        expect(updatedAt).to.be.greaterThan(createdAt);
        expect(scopes).to.have.lengthOf(1);
        expect(scopes).to.deep.equal(['scope4']);
      });
    });

    context('when application client id is not found', function () {
      it('should return false', async function () {
        // given
        const clientId = 'not found';
        const scopesToRemove = ['scope3', 'scope5', 'scope3'];

        // when
        const updated = await clientApplicationRepository.removeScopes(clientId, scopesToRemove);

        // then
        expect(updated).to.be.false;
      });
    });

    context('when removing all remaining scopes', function () {
      it('should throw an error', async function () {
        // given
        const clientId = application1.clientId;
        const scopesToRemove = ['scope1', 'scope2'];

        // when
        const result = clientApplicationRepository.removeScopes(clientId, scopesToRemove);

        // then
        await expect(result).to.be.rejectedWith(MissingClientApplicationScopesError);
        const { scopes, createdAt, updatedAt } = await knex
          .select()
          .from('client_applications')
          .where({ clientId })
          .first();
        expect(updatedAt).to.deep.equal(createdAt);
        expect(scopes).to.deep.equal(application1.scopes);
      });
    });
  });

  describe('#setClientSecret', function () {
    context('when application client id is found', function () {
      it('should change client secret of the client application and return true', async function () {
        // given
        const clientId = application1.clientId;
        const newSecret = 'newSecret';

        // when
        const updated = await clientApplicationRepository.setClientSecret(clientId, newSecret);

        // then
        expect(updated).to.be.true;
        const { clientSecret, createdAt, updatedAt } = await knex
          .select()
          .from('client_applications')
          .where({ clientId })
          .first();
        expect(updatedAt).to.be.greaterThan(createdAt);
        expect(clientSecret).to.equal(newSecret);
      });
    });

    context('when application client id is not found', function () {
      it('should return false', async function () {
        // given
        const clientId = 'not found';
        const newSecret = 'newSecret';

        // when
        const updated = await clientApplicationRepository.setClientSecret(clientId, newSecret);

        // then
        expect(updated).to.be.false;
      });
    });
  });
});
