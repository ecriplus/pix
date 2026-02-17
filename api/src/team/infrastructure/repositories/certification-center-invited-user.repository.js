import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../shared/domain/errors.js';
import { CertificationCenterInvitedUser } from '../../domain/models/CertificationCenterInvitedUser.js';

const get = async function ({ certificationCenterInvitationId, email }) {
  const knexConn = DomainTransaction.getConnection();

  const invitation = await knexConn('certification-center-invitations')
    .select('id', 'certificationCenterId', 'code', 'status', 'role', 'locale')
    .where({ id: certificationCenterInvitationId })
    .first();
  if (!invitation) {
    throw new NotFoundError(`No certification center invitation found for ID ${certificationCenterInvitationId}`);
  }

  const user = await knexConn('users').select('id').where({ email }).first();
  if (!user) {
    throw new NotFoundError(`No user found for email ${email} for this certification center invitation`);
  }

  return new CertificationCenterInvitedUser({
    userId: user.id,
    invitation,
    status: invitation.status,
    role: invitation.role,
    locale: invitation.locale,
  });
};

const save = async function (certificationCenterInvitedUser) {
  const knexConn = DomainTransaction.getConnection();

  await knexConn('certification-center-memberships').insert({
    certificationCenterId: certificationCenterInvitedUser.invitation.certificationCenterId,
    userId: certificationCenterInvitedUser.userId,
    role: certificationCenterInvitedUser.role,
  });

  await knexConn('certification-center-invitations')
    .update({ status: certificationCenterInvitedUser.status, updatedAt: new Date() })
    .where({ id: certificationCenterInvitedUser.invitation.id });
};

const certificationCenterInvitedUserRepository = { get, save };
export { certificationCenterInvitedUserRepository };
