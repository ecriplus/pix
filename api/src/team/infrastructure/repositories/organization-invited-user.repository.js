import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { InvitationNotFoundError, UserNotFoundError } from '../../../shared/domain/errors.js';
import { OrganizationInvitedUser } from '../../domain/models/OrganizationInvitedUser.js';

const get = async function ({ organizationInvitationId, userId }) {
  const knexConn = DomainTransaction.getConnection();

  const invitation = await knexConn('organization-invitations')
    .select('id', 'organizationId', 'code', 'role', 'status')
    .where({ id: organizationInvitationId })
    .first();
  if (!invitation) throw new InvitationNotFoundError();

  const user = await knexConn('users').select('id').where({ id: userId }).first();
  if (!user) {
    throw new UserNotFoundError();
  }

  const memberships = await knexConn('memberships')
    .select('id', 'userId', 'organizationRole')
    .where({
      organizationId: invitation.organizationId,
      disabledAt: null,
    })
    .orderBy('id', 'ASC');

  const existingMembership = memberships.find((membership) => membership.userId === user.id);

  return new OrganizationInvitedUser({
    userId: user.id,
    invitation,
    currentMembershipId: existingMembership?.id,
    currentRole: existingMembership?.organizationRole,
    organizationHasMemberships: memberships.length,
    status: invitation.status,
  });
};

const save = async function ({ organizationInvitedUser }) {
  const knexConn = DomainTransaction.getConnection();
  const date = new Date();

  if (organizationInvitedUser.isAlreadyMemberOfOrganization) {
    await knexConn('memberships')
      .update({
        organizationRole: organizationInvitedUser.currentRole,
        updatedAt: date,
      })
      .where({ id: organizationInvitedUser.currentMembershipId });
  } else {
    const [{ id: membershipId }] = await knexConn('memberships')
      .insert({
        organizationRole: organizationInvitedUser.currentRole,
        organizationId: organizationInvitedUser.invitation.organizationId,
        userId: organizationInvitedUser.userId,
      })
      .returning('id');

    organizationInvitedUser.currentMembershipId = membershipId;
  }

  await knexConn('user-orga-settings')
    .insert({
      userId: organizationInvitedUser.userId,
      currentOrganizationId: organizationInvitedUser.invitation.organizationId,
      updatedAt: new Date(),
    })
    .onConflict('userId')
    .merge();

  await knexConn('organization-invitations')
    .update({ status: organizationInvitedUser.status, updatedAt: date })
    .where({ id: organizationInvitedUser.invitation.id });
};

const organizationInvitedUserRepository = { get, save };
export { organizationInvitedUserRepository };
