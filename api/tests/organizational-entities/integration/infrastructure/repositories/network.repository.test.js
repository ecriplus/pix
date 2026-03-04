import * as networkRepository from '../../../../../src/organizational-entities/infrastructure/repositories/network.repository.js';
import { databaseBuilder, domainBuilder, expect, knex } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Infrastructure | Repositories | network', function () {
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
    it('saves a new network', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const networkName = 'Network 1';
      await databaseBuilder.commit();

      // when
      await networkRepository.save({ organizationId, networkName });

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
    });
  });
});
