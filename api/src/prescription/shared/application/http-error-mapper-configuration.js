import { campaignDomainErrorMappingConfiguration } from '../../campaign/application/http-error-mapper-configuration.js';
import { learnerManagementDomainErrorMappingConfiguration } from '../../learner-management/application/http-error-mapper-configuration.js';

const prescriptionDomainErrorMappingConfiguration = []
  .concat(campaignDomainErrorMappingConfiguration)
  .concat(learnerManagementDomainErrorMappingConfiguration);

export { prescriptionDomainErrorMappingConfiguration };
