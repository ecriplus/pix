import { CERTIFICATION_CENTER_MEMBERSHIP_ROLES } from '../../../../../src/shared/domain/models/CertificationCenterMembership.js';
import { usecases } from '../../../../../src/team/domain/usecases/index.js';
import { certificationCenterMembershipRepository } from '../../../../../src/team/infrastructure/repositories/certification-center-membership.repository.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../test-helper.js';

describe('Integration | Team | UseCases | update-certification-center-membership-last-accessed-at', function () {
  it('updates certification center membership lastAccessedAt', async function () {
    // given
    const now = new Date('2021-01-02');
    sinon.useFakeTimers({ now, toFake: ['Date'] });

    const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
    const userId = databaseBuilder.factory.buildUser().id;

    databaseBuilder.factory.buildCertificationCenterMembership({
      certificationCenterId,
      userId,
      certificationCenterRole: CERTIFICATION_CENTER_MEMBERSHIP_ROLES.MEMBER,
      lastAccessedAt: null,
    });

    await databaseBuilder.commit();

    // when
    await usecases.updateCertificationCenterMembershipLastAccessedAt({
      userId,
      certificationCenterId,
      certificationCenterMembershipRepository,
    });

    // then
    const certificationCenterMembership = await knex('certification-center-memberships')
      .where({ userId, certificationCenterId })
      .first();
    expect(certificationCenterMembership.lastAccessedAt).to.deep.equal(now);
  });
});
