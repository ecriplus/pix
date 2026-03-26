import { UnableToAttachChildOrganizationToParentOrganizationError } from '../../../../../src/organizational-entities/domain/errors.js';
import { attachChildOrganizationToOrganization } from '../../../../../src/organizational-entities/domain/usecases/attach-child-organization-to-organization.js';
import { DomainTransaction } from '../../../../../src/shared/domain/DomainTransaction.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Unit | Organizational Entities | Domain | UseCases | attach-child-organization-to-organization', function () {
  let organizationForAdminRepository;

  beforeEach(function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
      return callback();
    });

    organizationForAdminRepository = {
      findChildrenByParentOrganizationId: sinon.stub(),
      get: sinon.stub(),
      update: sinon.stub(),
    };
  });

  context('error cases', function () {
    context('when attaching child organization to itself', function () {
      it('throws an UnableToAttachChildOrganizationToParentOrganization error', async function () {
        // given
        const childOrganizationIds = '1,2,3';
        const parentOrganizationId = 1;
        const parentOrganization = domainBuilder.buildOrganizationForAdmin({
          id: parentOrganizationId,
        });
        organizationForAdminRepository.get.resolves(parentOrganization);

        // when
        const error = await catchErr(attachChildOrganizationToOrganization)({
          childOrganizationIds,
          parentOrganizationId,
          organizationForAdminRepository,
        });

        // then
        expect(error).to.be.instanceOf(UnableToAttachChildOrganizationToParentOrganizationError);
        expect(error.message).to.equal('Unable to attach child organization to itself');
        expect(error.code).to.equal('UNABLE_TO_ATTACH_CHILD_ORGANIZATION_TO_ITSELF');
        expect(error.meta).to.deep.equal({ childOrganizationId: 1, parentOrganizationId });
      });
    });

    context('when attaching an organization already belonging to a network', function () {
      it('throws an UnableToAttachChildOrganizationToParentOrganization error', async function () {
        // given
        const childOrganization = domainBuilder.buildOrganizationForAdmin({
          id: 123,
          name: 'Child Organization',
          parentOrganizationId: 321,
          networkId: 456,
        });
        const childOrganizationIds = `${childOrganization.id}`;
        const parentOrganizationId = 1;
        const parentOrganization = domainBuilder.buildOrganizationForAdmin({
          id: parentOrganizationId,
        });
        organizationForAdminRepository.get.resolves(parentOrganization);

        organizationForAdminRepository.get.resolves(childOrganization);
        organizationForAdminRepository.findChildrenByParentOrganizationId.resolves([]);

        // when
        const error = await catchErr(attachChildOrganizationToOrganization)({
          childOrganizationIds,
          parentOrganizationId,
          organizationForAdminRepository,
        });

        // then
        expect(organizationForAdminRepository.get.getCall(1)).to.have.been.calledWithExactly({
          organizationId: childOrganization.id,
        });
        expect(organizationForAdminRepository.update).to.not.have.been.called;
        expect(error).to.be.instanceOf(UnableToAttachChildOrganizationToParentOrganizationError);
        expect(error.message).to.equal('Unable to attach organization already belonging to a network');
        expect(error.code).to.equal('UNABLE_TO_ATTACH_ALREADY_ATTACHED_CHILD_ORGANIZATION');
        expect(error.meta).to.deep.equal({ childOrganizationId: 123 });
      });
    });
  });

  context('success cases', function () {
    it('attach each child organization to parent organization', async function () {
      // given
      const parentOrganizationId = 12;
      const parentOrganization = domainBuilder.buildOrganizationForAdmin({
        id: parentOrganizationId,
      });
      organizationForAdminRepository.get.resolves(parentOrganization);

      const firstChildOrganization = domainBuilder.buildOrganizationForAdmin({ id: 1234 });
      const secondChildOrganization = domainBuilder.buildOrganizationForAdmin({ id: 567 });

      organizationForAdminRepository.get.onCall(1).resolves(firstChildOrganization);
      organizationForAdminRepository.get.onCall(2).resolves(secondChildOrganization);

      organizationForAdminRepository.findChildrenByParentOrganizationId.onCall(0).resolves([]);
      organizationForAdminRepository.findChildrenByParentOrganizationId.onCall(1).resolves([]);

      // when
      await attachChildOrganizationToOrganization({
        childOrganizationIds: '1234, 567',
        parentOrganizationId,
        organizationForAdminRepository,
      });

      // then
      const expectedFirstChildOrganization = domainBuilder.buildOrganizationForAdmin({
        id: 1234,
        parentOrganizationId,
      });
      const expectedSecondChildOrganization = domainBuilder.buildOrganizationForAdmin({
        id: 567,
        parentOrganizationId,
      });

      expect(organizationForAdminRepository.update).to.have.been.calledWith({
        organization: expectedFirstChildOrganization,
      });
      expect(organizationForAdminRepository.update).to.have.been.calledWith({
        organization: expectedSecondChildOrganization,
      });
    });
  });
});
