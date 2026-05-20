import { HttpErrors } from '../../shared/application/errors/http-errors.js';
import {
  AlreadyExistingAdminMemberError,
  OrganizationArchivedError,
  UncancellableOrganizationInvitationError,
} from '../domain/errors.js';

const teamDomainErrorMappingConfiguration = [
  {
    name: UncancellableOrganizationInvitationError.name,
    httpErrorFn: (error) => new HttpErrors.UnprocessableEntityError(error.message),
  },
  {
    name: AlreadyExistingAdminMemberError.name,
    httpErrorFn: (error) => new HttpErrors.UnprocessableEntityError(error.message),
  },
  {
    name: OrganizationArchivedError.name,
    httpErrorFn: (error) => new HttpErrors.UnprocessableEntityError(error.message),
  },
];

export { teamDomainErrorMappingConfiguration };
