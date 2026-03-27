import { UnableToAttachChildOrganizationToParentOrganizationError } from '../../../../../src/organizational-entities/domain/errors.js';
import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Domain | UseCase | attach-child-organization-to-organization', function () {
  describe('success case', function () {
    it('attaches children organizations to parent organization', async function () {
      // given
      const parentOrganization = await databaseBuilder.factory.buildOrganization({ id: 123 });
      const parentStructure = databaseBuilder.factory.buildStructure();
      const network = databaseBuilder.factory.buildNetwork();
      databaseBuilder.factory.buildFactStructure({
        organizationId: parentOrganization.id,
        structureId: parentStructure.id,
        networkId: network.id,
      });

      const firstChildOrganization = await databaseBuilder.factory.buildOrganization({ id: 456 });
      const firstChildStructure = databaseBuilder.factory.buildStructure();
      databaseBuilder.factory.buildFactStructure({
        organizationId: firstChildOrganization.id,
        structureId: firstChildStructure.id,
        networkId: null,
      });

      const secondChildOrganization = await databaseBuilder.factory.buildOrganization({ id: 789 });
      const secondChildStructure = databaseBuilder.factory.buildStructure();
      databaseBuilder.factory.buildFactStructure({
        organizationId: secondChildOrganization.id,
        structureId: secondChildStructure.id,
        networkId: null,
      });

      await databaseBuilder.commit();

      const childOrganizationIds = `${firstChildOrganization.id},${secondChildOrganization.id}`;

      // when
      await usecases.attachChildOrganizationToOrganization({
        parentOrganizationId: parentOrganization.id,
        childOrganizationIds,
      });

      // then
      const childrenOrganizationFactStructures = await knex('fct_structures').whereIn('organization_id', [
        firstChildOrganization.id,
        secondChildOrganization.id,
      ]);
      expect(childrenOrganizationFactStructures).to.have.deep.members([
        {
          organization_id: firstChildOrganization.id,
          structure_id: firstChildStructure.id,
          network_id: network.id,
          parent_structure_id: parentStructure.id,
          child_structure_id: null,
        },
        {
          organization_id: secondChildOrganization.id,
          structure_id: secondChildStructure.id,
          parent_structure_id: parentStructure.id,
          network_id: network.id,
          child_structure_id: null,
        },
      ]);
    });
  });

  describe('error cases', function () {
    context('when parent organization does not exist', function () {
      it('throws an error', async function () {
        // given
        const unknownParentOrganizationId = 123;

        // when
        const error = await catchErr(usecases.attachChildOrganizationToOrganization)({
          parentOrganizationId: unknownParentOrganizationId,
        });

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });

    context('when parent organization is not part of a network', function () {
      it('throws an error', async function () {
        // given
        const parentOrganization = await databaseBuilder.factory.buildOrganization();
        await databaseBuilder.commit();

        // when
        const error = await catchErr(usecases.attachChildOrganizationToOrganization)({
          parentOrganizationId: parentOrganization.id,
        });

        // then
        expect(error).to.deepEqualInstance(
          new UnableToAttachChildOrganizationToParentOrganizationError({
            code: 'UNABLE_TO_ATTACH_TO_ORGANIZATION_NOT_IN_NETWORK',
            message: 'Unable to attach organization to an organization that does not belong to a network',
            meta: {
              parentOrganizationId: parentOrganization.id,
            },
          }),
        );
      });
    });

    context('when at least one of children organization ids is equal to parent organization id', function () {
      it('throws an error', async function () {
        // given
        const parentOrganization = await databaseBuilder.factory.buildOrganization({ id: 123 });
        const structure = databaseBuilder.factory.buildStructure();
        const network = databaseBuilder.factory.buildNetwork();
        databaseBuilder.factory.buildFactStructure({
          organizationId: parentOrganization.id,
          structureId: structure.id,
          networkId: network.id,
        });
        await databaseBuilder.commit();

        const childOrganizationIds = `${parentOrganization.id},456`;

        // when
        const error = await catchErr(usecases.attachChildOrganizationToOrganization)({
          parentOrganizationId: parentOrganization.id,
          childOrganizationIds,
        });

        // then
        expect(error).to.deepEqualInstance(
          new UnableToAttachChildOrganizationToParentOrganizationError({
            code: 'UNABLE_TO_ATTACH_CHILD_ORGANIZATION_TO_ITSELF',
            message: 'Unable to attach child organization to itself',
            meta: {
              childOrganizationId: parentOrganization.id,
              parentOrganizationId: parentOrganization.id,
            },
          }),
        );
      });
    });

    context('when at least one of children organization is already part of a network', function () {
      it('throws an error', async function () {
        // given
        const parentOrganization = await databaseBuilder.factory.buildOrganization({ id: 123 });
        const structure = databaseBuilder.factory.buildStructure();
        const network = databaseBuilder.factory.buildNetwork();
        databaseBuilder.factory.buildFactStructure({
          organizationId: parentOrganization.id,
          structureId: structure.id,
          networkId: network.id,
        });

        const childOrganization = await databaseBuilder.factory.buildOrganization({ id: 456 });
        const childStructure = databaseBuilder.factory.buildStructure();
        const otherNetwork = databaseBuilder.factory.buildNetwork();
        databaseBuilder.factory.buildFactStructure({
          organizationId: childOrganization.id,
          structureId: childStructure.id,
          networkId: otherNetwork.id,
        });

        await databaseBuilder.commit();

        const childOrganizationIds = `${childOrganization.id}`;

        // when
        const error = await catchErr(usecases.attachChildOrganizationToOrganization)({
          parentOrganizationId: parentOrganization.id,
          childOrganizationIds,
        });

        // then
        expect(error).to.deepEqualInstance(
          new UnableToAttachChildOrganizationToParentOrganizationError({
            code: 'UNABLE_TO_ATTACH_ALREADY_ATTACHED_CHILD_ORGANIZATION',
            message: 'Unable to attach organization already belonging to a network',
            meta: {
              childOrganizationId: childOrganization.id,
            },
          }),
        );
      });
    });
  });
});
