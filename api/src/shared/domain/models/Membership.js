import { InvalidMembershipOrganizationRoleError } from '../errors.js';

const roles = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
};

class Membership {
  constructor({ id, organizationRole = roles.MEMBER, updatedByUserId, organization, user, disabledAt } = {}) {
    this.id = id;
    this.organizationRole = organizationRole;
    this.updatedByUserId = updatedByUserId;
    this.organization = organization;
    this.user = user;
    this.disabledAt = disabledAt;
  }

  get isAdmin() {
    return this.organizationRole === roles.ADMIN;
  }

  validateRole() {
    const isRoleValid = Object.values(roles).includes(this.organizationRole);
    if (!isRoleValid) {
      throw new InvalidMembershipOrganizationRoleError();
    }
  }
}

Membership.roles = roles;

export { Membership, roles };
