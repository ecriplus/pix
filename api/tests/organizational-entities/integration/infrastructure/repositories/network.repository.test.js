import * as networkRepository from '../../../../../src/organizational-entities/infrastructure/repositories/network.repository.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, domainBuilder, expect, knex } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Infrastructure | Repositories | network', function () {
  describe('#findAll', function () {
    describe('when there are networks', function () {
      it('returns the networks ordered by name', async function () {
        // given
        const secondNetwork = databaseBuilder.factory.buildNetwork({ name: 'B Réseau' });
        const firstNetwork = databaseBuilder.factory.buildNetwork({ name: 'A Réseau' });

        await databaseBuilder.commit();

        // when
        const foundNetworks = await networkRepository.findAll();

        // then
        const expectedFirstNetwork = domainBuilder.acquisition.buildNetwork({
          id: firstNetwork.id,
          name: firstNetwork.name,
        });

        const expectedSecondNetwork = domainBuilder.acquisition.buildNetwork({
          id: secondNetwork.id,
          name: secondNetwork.name,
        });

        expect(foundNetworks).to.have.lengthOf(2);
        expect(foundNetworks[0]).to.deepEqualInstance(expectedFirstNetwork);
        expect(foundNetworks[1]).to.deepEqualInstance(expectedSecondNetwork);
      });
    });

    describe('when there are no networks', function () {
      it('returns an empty array', async function () {
        // when
        const foundNetworks = await networkRepository.findAll();

        // then
        expect(foundNetworks).to.be.empty;
      });
    });
  });

  describe('#getById', function () {
    describe('when the network is found', function () {
      it('returns the network with head organization informations', async function () {
        // given
        const headOrganization = databaseBuilder.factory.buildOrganization({ name: 'Orga tête de réseau' });
        const headStructureId = databaseBuilder.factory.buildStructure().id;

        const network = databaseBuilder.factory.buildNetwork({ name: 'Mon super réseau' });

        databaseBuilder.factory.buildFactStructure({
          structureId: headStructureId,
          networkId: network.id,
          organizationId: headOrganization.id,
        });

        await databaseBuilder.commit();

        // when
        const foundNetwork = await networkRepository.getById(network.id);

        // then
        const expectedNetwork = domainBuilder.acquisition.buildNetwork({
          id: network.id,
          name: 'Mon super réseau',
          organizationId: headOrganization.id,
          organizationName: 'Orga tête de réseau',
        });

        expect(foundNetwork).to.deepEqualInstance(expectedNetwork);
      });

      context('when there are several organizations in the network', function () {
        it('returns the network with correct head organization informations', async function () {
          // given
          const childOrganization = databaseBuilder.factory.buildOrganization({
            name: 'Not head organization but still in the same network',
          });
          const childStructureId = databaseBuilder.factory.buildStructure().id;
          const headOrganization = databaseBuilder.factory.buildOrganization({ name: 'Head organization' });
          const headStructureId = databaseBuilder.factory.buildStructure().id;

          const network = databaseBuilder.factory.buildNetwork({ name: 'My network' });

          databaseBuilder.factory.buildFactStructure({
            structureId: headStructureId,
            networkId: network.id,
            organizationId: headOrganization.id,
          });

          databaseBuilder.factory.buildFactStructure({
            structureId: childStructureId,
            networkId: network.id,
            organizationId: childOrganization.id,
            parentStructureId: headStructureId,
          });

          await databaseBuilder.commit();

          // when
          const foundNetwork = await networkRepository.getById(network.id);

          // then
          const expectedNetwork = domainBuilder.acquisition.buildNetwork({
            id: network.id,
            name: 'My network',
            organizationId: headOrganization.id,
            organizationName: 'Head organization',
          });

          expect(foundNetwork).to.deepEqualInstance(expectedNetwork);
        });
      });
    });

    describe('when the network is not found', function () {
      it('throws a not found error', async function () {
        // given
        const headOrganization = databaseBuilder.factory.buildOrganization({ name: 'Orga tête de réseau' });
        const headStructureId = databaseBuilder.factory.buildStructure().id;

        const network = databaseBuilder.factory.buildNetwork({ id: 1, name: 'Réseau avec id 1' });

        databaseBuilder.factory.buildFactStructure({
          structureId: headStructureId,
          networkId: network.id,
          organizationId: headOrganization.id,
        });

        await databaseBuilder.commit();

        const nonExistingNetworkId = 2;

        // when
        const error = await catchErr(networkRepository.getById)(nonExistingNetworkId);

        // then

        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });

  describe('#findByOrganizationId', function () {
    describe('when an organization belongs to a network', function () {
      it('returns the network', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const network = databaseBuilder.factory.buildNetwork();
        const structureId = databaseBuilder.factory.buildStructure().id;
        databaseBuilder.factory.buildFactStructure({
          structureId,
          networkId: network.id,
          organizationId,
        });

        await databaseBuilder.commit();

        const expectedNetwork = domainBuilder.acquisition.buildNetwork(network);

        // when
        const foundNetwork = await networkRepository.findByOrganizationId(organizationId);

        // then
        expect(foundNetwork).to.deepEqualInstance(expectedNetwork);
      });
    });

    describe('when an organization does not belong to a network', function () {
      it('returns null', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;

        await databaseBuilder.commit();

        // when
        const result = await networkRepository.findByOrganizationId(organizationId);

        // then
        expect(result).to.be.null;
      });
    });
  });

  describe('#save', function () {
    it('saves and returns the new network', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const networkName = 'Network 1';
      await databaseBuilder.commit();

      // when
      const savedNetwork = await networkRepository.save({ organizationId, networkName });

      // then
      const foundNetwork = await knex('networks').select('id', 'name').where({ name: networkName }).first();
      expect(foundNetwork).to.deep.equal({
        id: foundNetwork.id,
        name: networkName,
      });
      const createdStructure = await knex('structures')
        .join('fct_structures', 'structures.id', 'fct_structures.structure_id')
        .where('fct_structures.organization_id', organizationId)
        .first();
      expect(createdStructure).to.exist;
      const createdFactStructure = await knex('fct_structures')
        .where('fct_structures.organization_id', organizationId)
        .first();
      expect(createdFactStructure.network_id).to.equal(foundNetwork.id);
      const expectedNetwork = domainBuilder.acquisition.buildNetwork(foundNetwork);
      expect(savedNetwork).to.deep.equal(expectedNetwork);
    });
  });
});
