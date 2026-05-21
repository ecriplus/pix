import { HttpErrors } from '../../../../src/shared/application/errors/http-errors.js';
import { teamDomainErrorMappingConfiguration } from '../../../../src/team/application/http-error-mapper-configuration.js';
import {
  AlreadyAcceptedOrCancelledInvitationError,
  AlreadyExistingAdminMemberError,
  OrganizationArchivedError,
  UncancellableOrganizationInvitationError,
} from '../../../../src/team/domain/errors.js';
import { expect } from '../../../test-helper.js';

describe('Unit | Team | Application | HttpErrorMapperConfiguration', function () {
  it('instantiates UnprocessableEntityError when UncancellableOrganizationInvitationError', async function () {
    //given
    const httpErrorMapper = teamDomainErrorMappingConfiguration.find(
      (httpErrorMapper) => httpErrorMapper.name === UncancellableOrganizationInvitationError.name,
    );

    //when
    const error = httpErrorMapper.httpErrorFn(new UncancellableOrganizationInvitationError());

    //then
    expect(error).to.be.instanceOf(HttpErrors.UnprocessableEntityError);
  });

  it('instantiates UnprocessableEntityError when AlreadyExistingAdminMemberError', async function () {
    //given
    const httpErrorMapper = teamDomainErrorMappingConfiguration.find(
      (httpErrorMapper) => httpErrorMapper.name === AlreadyExistingAdminMemberError.name,
    );

    //when
    const error = httpErrorMapper.httpErrorFn(new AlreadyExistingAdminMemberError());

    //then
    expect(error).to.be.instanceOf(HttpErrors.UnprocessableEntityError);
  });

  it('instantiates UnprocessableEntityError when OrganizationArchivedError', async function () {
    //given
    const httpErrorMapper = teamDomainErrorMappingConfiguration.find(
      (httpErrorMapper) => httpErrorMapper.name === OrganizationArchivedError.name,
    );

    //when
    const error = httpErrorMapper.httpErrorFn(new OrganizationArchivedError());

    //then
    expect(error).to.be.instanceOf(HttpErrors.UnprocessableEntityError);
    expect(error.message).to.equal("L'organisation est archivée.");
  });

  it('instantiates ConflictError when AlreadyAcceptedOrCancelledInvitationError', async function () {
    //given
    const httpErrorMapper = teamDomainErrorMappingConfiguration.find(
      (httpErrorMapper) => httpErrorMapper.name === AlreadyAcceptedOrCancelledInvitationError.name,
    );

    //when
    const error = httpErrorMapper.httpErrorFn(new AlreadyAcceptedOrCancelledInvitationError());

    //then
    expect(error).to.be.instanceOf(HttpErrors.ConflictError);
    expect(error.message).to.equal('The invitation has already been accepted or cancelled');
  });
});
