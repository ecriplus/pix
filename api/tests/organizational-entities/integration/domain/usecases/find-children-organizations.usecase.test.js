import { OrganizationForAdmin } from '../../../../../src/organizational-entities/domain/models/OrganizationForAdmin.js';
import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Domain | UseCase | findChildrenOrganizations', function () {
  it('returns a list of child organizations', async function () {
    // given
    const parentOrganizationId = databaseBuilder.factory.buildOrganization({
      name: 'name_ok_1',
      type: 'SCO',
      externalId: '1234567A',
    }).id;

    const childOrganization = databaseBuilder.factory.buildOrganization({
      name: 'First Child',
      type: 'SCO',
      parentOrganizationId,
    });

    await databaseBuilder.commit();

    const expectedChildOrganizations = new OrganizationForAdmin(childOrganization);

    // when
    const childOrganizations = await usecases.findChildrenOrganizations({
      parentOrganizationId,
    });

    // then
    expect(childOrganizations).to.deep.include.members([expectedChildOrganizations]);
  });

  context('when parent organization does not exist', function () {
    it('throws a NotFound error', async function () {
      // given
      const parentOrganizationId = 654654;

      // when
      const error = await catchErr(usecases.findChildrenOrganizations)({
        parentOrganizationId,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal(`Organization with ID (${parentOrganizationId}) not found`);
    });
  });
});
