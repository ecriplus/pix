import { Membership } from '../../../../../src/shared/domain/models/Membership.js';
import { usecases } from '../../../../../src/team/domain/usecases/index.js';
import * as membershipRepository from '../../../../../src/team/infrastructure/repositories/membership.repository.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../test-helper.js';

describe('Integration | Team | UseCases | update-membership-last-accessed-at', function () {
  let clock;
  const now = new Date('2022-12-01');

  beforeEach(function () {
    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
  });

  afterEach(function () {
    clock.restore();
  });

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
    expect(membership.lastAccessedAt).to.deep.equal(now);
    expect(membership.updatedAt).to.deep.equal(now);
  });
});
