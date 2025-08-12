import { HttpErrors } from '../../../shared/application/http-errors.js';
import { DomainErrorMappingConfiguration } from '../../../shared/application/models/domain-error-mapping-configuration.js';
import { configurationDomainErrorMappingConfiguration } from '../../configuration/application/http-error-mapper-configuration.js';
import { enrolmentDomainErrorMappingConfiguration } from '../../enrolment/application/http-error-mapper-configuration.js';
import {
  parcoursupDomainErrorMappingConfiguration,
  resultsDomainErrorMappingConfiguration,
} from '../../results/application/http-error-mapper-configuration.js';
import { sessionDomainErrorMappingConfiguration } from '../../session-management/application/http-error-mapper-configuration.js';
import {
  CenterHabilitationError,
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
].map((domainErrorMappingConfiguration) => new DomainErrorMappingConfiguration(domainErrorMappingConfiguration));

certificationDomainErrorMappingConfiguration.push(
  ...parcoursupDomainErrorMappingConfiguration,
  ...resultsDomainErrorMappingConfiguration,
  ...enrolmentDomainErrorMappingConfiguration,
  ...sessionDomainErrorMappingConfiguration,
  ...configurationDomainErrorMappingConfiguration,
);
export { certificationDomainErrorMappingConfiguration };
