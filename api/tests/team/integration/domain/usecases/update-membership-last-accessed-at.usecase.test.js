import { Membership } from '../../../../../src/shared/domain/models/Membership.js';
import { usecases } from '../../../../../src/team/domain/usecases/index.js';
import * as membershipRepository from '../../../../../src/team/infrastructure/repositories/membership.repository.js';
import { databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Integration | Team | UseCases | update-membership-last-accessed-at', function () {
  it('updates membership lastAccessedAt', async function () {
    // given
    const organizationId = databaseBuilder.factory.buildOrganization().id;
    const userId = databaseBuilder.factory.buildUser().id;

    databaseBuilder.factory.buildMembership({
      organizationId,
      userId,
      organizationRole: Membership.roles.MEMBER,
      lastAccessedAt: null,
    });

    await databaseBuilder.commit();

    // when
    await usecases.updateMembershipLastAccessedAt({
      userId,
      organizationId,
      membershipRepository,
    });

    // then
    const membership = await knex('memberships').where({ userId, organizationId }).first();
    expect(membership.lastAccessedAt).to.be.a('date');
    expect(membership.lastAccessedAt).to.deep.equal(membership.updatedAt);
  });
});
