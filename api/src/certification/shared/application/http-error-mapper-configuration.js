import { HttpErrors } from '../../../shared/application/errors/http-errors.js';
import { configurationDomainErrorMappingConfiguration } from '../../configuration/application/http-error-mapper-configuration.js';
import { enrolmentDomainErrorMappingConfiguration } from '../../enrolment/application/http-error-mapper-configuration.js';
import {
  parcoursupDomainErrorMappingConfiguration,
  resultsDomainErrorMappingConfiguration,
} from '../../results/application/http-error-mapper-configuration.js';
import { sessionDomainErrorMappingConfiguration } from '../../session-management/application/http-error-mapper-configuration.js';
import {
  CenterHabilitationError,
  CertificationCandidateNotFoundError,
  CertificationCourseUpdateError,
  InvalidCertificationReportForFinalization,
} from '../domain/errors.js';

const certificationDomainErrorMappingConfiguration = [
  {
    name: InvalidCertificationReportForFinalization.name,
    httpErrorFn: (error) => {
      return new HttpErrors.BadRequestError(error.message, error.code, error.meta);
    },
  },
  {
    name: CertificationCourseUpdateError.name,
    httpErrorFn: (error) => new HttpErrors.BadRequestError(error.message, error.code, error.meta),
  },
  {
    name: CenterHabilitationError.name,
    httpErrorFn: (error) => new HttpErrors.ForbiddenError(error.message, error.code),
  },
  {
    name: CertificationCandidateNotFoundError.name,
    httpErrorFn: (error) => new HttpErrors.NotFoundError(error.message, error.code),
  },
];

certificationDomainErrorMappingConfiguration.push(
  ...parcoursupDomainErrorMappingConfiguration,
  ...resultsDomainErrorMappingConfiguration,
  ...enrolmentDomainErrorMappingConfiguration,
  ...sessionDomainErrorMappingConfiguration,
  ...configurationDomainErrorMappingConfiguration,
);
export { certificationDomainErrorMappingConfiguration };
