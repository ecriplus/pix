import * as organizationMemberIdentitiesController from '../../../../../src/team/application/membership/organization-member-identities.controller.js';
import { usecases } from '../../../../../src/team/domain/usecases/index.js';
import { expect, hFake, sinon } from '../../../../test-helper.js';

describe('Unit | Application | Membership | organization-member-identities', function () {
  describe('#getOrganizationMemberIdentities', function () {
    it('returns all members identities of the organization serialized', async function () {
      // given
      const organizationId = 1234;
      const members = Symbol('members');
      const serializedMembersIdentities = Symbol('members serialized');

      sinon.stub(usecases, 'getOrganizationMemberIdentities').withArgs({ organizationId }).returns(members);
      const organizationMemberIdentitySerializerStub = {
        serialize: sinon.stub(),
      };
      const dependencies = {
        organizationMemberIdentitySerializer: organizationMemberIdentitySerializerStub,
      };
      organizationMemberIdentitySerializerStub.serialize.withArgs(members).returns(serializedMembersIdentities);

      // when
      const request = { params: { id: organizationId } };
      const result = await organizationMemberIdentitiesController.getOrganizationMemberIdentities(
        request,
        hFake,
        dependencies,
      );

      // then
      expect(result).to.be.equal(serializedMembersIdentities);
    });
  });
});
