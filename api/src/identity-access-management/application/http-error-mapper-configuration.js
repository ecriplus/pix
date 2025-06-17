import { HttpErrors } from '../../shared/application/http-errors.js';
import { DomainErrorMappingConfiguration } from '../../shared/application/models/domain-error-mapping-configuration.js';
import {
  AuthenticationKeyExpired,
  DifferentExternalIdentifierError,
  InvalidOrAlreadyUsedEmailError,
  MissingOrInvalidCredentialsError,
  MissingUserAccountError,
  PasswordResetDemandNotFoundError,
  PixAdminLoginFromPasswordDisabledError,
  UserCantBeCreatedError,
  UserShouldChangePasswordError,
} from '../domain/errors.js';

const authenticationDomainErrorMappingConfiguration = [
  {
    name: AuthenticationKeyExpired.name,
    httpErrorFn: (error) => new HttpErrors.UnauthorizedError(error.message, error.code),
  },
  {
    name: DifferentExternalIdentifierError.name,
    httpErrorFn: (error) => new HttpErrors.ConflictError(error.message),
  },
  {
    name: InvalidOrAlreadyUsedEmailError.name,
    httpErrorFn: (error) => new HttpErrors.UnprocessableEntityError(error.message, error.code),
  },
  {
    name: MissingOrInvalidCredentialsError.name,
    httpErrorFn: (error) => new HttpErrors.UnauthorizedError(error.message, error.code, error.meta),
  },
  {
    name: MissingUserAccountError.name,
    httpErrorFn: (error) => new HttpErrors.BadRequestError(error.message),
  },
  {
    name: PasswordResetDemandNotFoundError.name,
    httpErrorFn: (error) => new HttpErrors.NotFoundError(error.message),
  },
  {
    name: PixAdminLoginFromPasswordDisabledError.name,
    httpErrorFn: (error) => new HttpErrors.UnauthorizedError(error.message, error.code),
  },
  {
    name: UserCantBeCreatedError.name,
    httpErrorFn: (error) => new HttpErrors.UnauthorizedError(error.message),
  },
  {
    name: UserShouldChangePasswordError.name,
    httpErrorFn: (error) => new HttpErrors.PasswordShouldChangeError(error.message, error.meta),
  },
].map((domainErrorMappingConfiguration) => new DomainErrorMappingConfiguration(domainErrorMappingConfiguration));

export { authenticationDomainErrorMappingConfiguration };
