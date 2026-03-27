import { UnableToAttachChildOrganizationToParentOrganizationError } from '../../../../../src/organizational-entities/domain/errors.js';
import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Domain | UseCase | attach-child-organization-to-organization', function () {
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
