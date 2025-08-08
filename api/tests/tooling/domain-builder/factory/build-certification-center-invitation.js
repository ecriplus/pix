import { CertificationCenterInvitation } from '../../../../src/team/domain/models/CertificationCenterInvitation.js';

const buildCertificationCenterInvitation = function ({
  id = 123,
  certificationCenterId = 456,
  email = 'userInvited@example.net',
  status = CertificationCenterInvitation.StatusType.PENDING,
  role = 'MEMBER',
  code = 'ABCDE12345',
  locale = 'fr',
  createdAt = new Date('2020-01-01'),
  updatedAt = new Date('2020-01-02'),
} = {}) {
  return new CertificationCenterInvitation({
    id,
    certificationCenterId,
    email,
    status,
    role,
    code,
    locale,
    createdAt,
    updatedAt,
  });
};

export { buildCertificationCenterInvitation };
