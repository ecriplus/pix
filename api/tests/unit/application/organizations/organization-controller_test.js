import { organizationController } from '../../../../lib/application/organizations/organization-controller.js';
import { usecases } from '../../../../lib/domain/usecases/index.js';
import { Organization } from '../../../../src/shared/domain/models/index.js';
import { expect, hFake, sinon } from '../../../test-helper.js';

describe('Unit | Application | Organizations | organization-controller', function () {
  describe('#findPaginatedFilteredOrganizations', function () {
    let dependencies;

    beforeEach(function () {
      const organizationSerializerStub = {
        serialize: sinon.stub(),
      };
      dependencies = {
        organizationSerializer: organizationSerializerStub,
      };
      sinon.stub(usecases, 'findPaginatedFilteredOrganizations');
    });

    it('should return a list of JSON API organizations fetched from the data repository', async function () {
      // given
      const request = { query: {} };
      usecases.findPaginatedFilteredOrganizations.resolves({ models: {}, pagination: {} });
      dependencies.organizationSerializer.serialize.returns({ data: {}, meta: {} });

      // when
      await organizationController.findPaginatedFilteredOrganizations(request, hFake, dependencies);

      // then
      expect(usecases.findPaginatedFilteredOrganizations).to.have.been.calledOnce;
      expect(dependencies.organizationSerializer.serialize).to.have.been.calledOnce;
    });

    it('should return a JSON API response with pagination information in the data field "meta"', async function () {
      // given
      const request = { query: {} };
      const expectedResults = [new Organization({ id: 1 }), new Organization({ id: 2 }), new Organization({ id: 3 })];
      const expectedPagination = { page: 2, pageSize: 25, itemsCount: 100, pagesCount: 4 };
      usecases.findPaginatedFilteredOrganizations.resolves({ models: expectedResults, pagination: expectedPagination });

      // when
      await organizationController.findPaginatedFilteredOrganizations(request, hFake, dependencies);

      // then
      expect(dependencies.organizationSerializer.serialize).to.have.been.calledWithExactly(
        expectedResults,
        expectedPagination,
      );
    });

    it('should allow to filter organization by name', async function () {
      // given
      const query = { filter: { name: 'organization_name' }, page: {} };
      const request = { query };
      usecases.findPaginatedFilteredOrganizations.resolves({ models: {}, pagination: {} });

      // when
      await organizationController.findPaginatedFilteredOrganizations(request, hFake, dependencies);

      // then
      expect(usecases.findPaginatedFilteredOrganizations).to.have.been.calledWithMatch(query);
    });

    it('should allow to filter organization by code', async function () {
      // given
      const query = { filter: { code: 'organization_code' }, page: {} };
      const request = { query };
      usecases.findPaginatedFilteredOrganizations.resolves({ models: {}, pagination: {} });

      // when
      await organizationController.findPaginatedFilteredOrganizations(request, hFake, dependencies);

      // then
      expect(usecases.findPaginatedFilteredOrganizations).to.have.been.calledWithMatch(query);
    });

    it('should allow to filter users by type', async function () {
      // given
      const query = { filter: { type: 'organization_type' }, page: {} };
      const request = { query };
      usecases.findPaginatedFilteredOrganizations.resolves({ models: {}, pagination: {} });

      // when
      await organizationController.findPaginatedFilteredOrganizations(request, hFake, dependencies);

      // then
      expect(usecases.findPaginatedFilteredOrganizations).to.have.been.calledWithMatch(query);
    });

    it('should allow to paginate on a given page and page size', async function () {
      // given
      const query = { filter: { name: 'organization_name' }, page: { number: 2, size: 25 } };
      const request = { query };
      usecases.findPaginatedFilteredOrganizations.resolves({ models: {}, pagination: {} });

      // when
      await organizationController.findPaginatedFilteredOrganizations(request, hFake, dependencies);

      // then
      expect(usecases.findPaginatedFilteredOrganizations).to.have.been.calledWithMatch(query);
    });
  });

  describe('#findChildrenOrganizationsForAdmin', function () {
    it('calls findChildrenOrganizationsForAdmin usecase and returns a serialized list of organizations', async function () {
      // given
      const parentOrganizationId = 1;
      const organizations = Symbol('child organizations list');
      const childOrganizationsSerialized = Symbol('child organizations serialized list');
      const dependencies = {
        organizationForAdminSerializer: { serialize: sinon.stub() },
      };

      sinon.stub(usecases, 'findChildrenOrganizationsForAdmin').resolves(organizations);
      dependencies.organizationForAdminSerializer.serialize.resolves(childOrganizationsSerialized);

      const request = {
        params: { organizationId: parentOrganizationId },
      };

      // when
      const response = await organizationController.findChildrenOrganizationsForAdmin(request, hFake, dependencies);

      // then
      expect(usecases.findChildrenOrganizationsForAdmin).to.have.been.calledWithExactly({ parentOrganizationId });
      expect(dependencies.organizationForAdminSerializer.serialize).to.have.been.calledWithExactly(organizations);
      expect(response).to.deep.equal(childOrganizationsSerialized);
    });
  });
});
