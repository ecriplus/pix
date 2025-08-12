import { HttpErrors } from '../../../shared/application/http-errors.js';
import { DomainErrorMappingConfiguration } from '../../../shared/application/models/domain-error-mapping-configuration.js';
import { configurationDomainErrorMappingConfiguration } from '../../configuration/application/http-error-mapper-configuration.js';
import { enrolmentDomainErrorMappingConfiguration } from '../../enrolment/application/http-error-mapper-configuration.js';
import { evaluationDomainErrorMappingConfiguration } from '../../evaluation/application/http-error-mapper-configuration.js';
import {
  parcoursupDomainErrorMappingConfiguration,
  resultsDomainErrorMappingConfiguration,
} from '../../results/application/http-error-mapper-configuration.js';
import { sessionDomainErrorMappingConfiguration } from '../../session-management/application/http-error-mapper-configuration.js';
import { CertificationCourseUpdateError, InvalidCertificationReportForFinalization } from '../domain/errors.js';

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
].map((domainErrorMappingConfiguration) => new DomainErrorMappingConfiguration(domainErrorMappingConfiguration));

certificationDomainErrorMappingConfiguration.push(
  ...parcoursupDomainErrorMappingConfiguration,
  ...resultsDomainErrorMappingConfiguration,
  ...enrolmentDomainErrorMappingConfiguration,
  ...sessionDomainErrorMappingConfiguration,
  ...configurationDomainErrorMappingConfiguration,
  ...evaluationDomainErrorMappingConfiguration,
);
export { certificationDomainErrorMappingConfiguration };
