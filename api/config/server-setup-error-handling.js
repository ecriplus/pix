import { certificationDomainErrorMappingConfiguration } from '../src/certification/shared/application/http-error-mapper-configuration.js';
import { devcompDomainErrorMappingConfiguration } from '../src/devcomp/application/http-error-mapper-configuration.js';
import { evaluationDomainErrorMappingConfiguration } from '../src/evaluation/application/http-error-mapper-configuration.js';
import { authenticationDomainErrorMappingConfiguration } from '../src/identity-access-management/application/http-error-mapper-configuration.js';
import { legalDocumentsDomainErrorMappingConfiguration } from '../src/legal-documents/application/http-error-mapper-configuration.js';
import { organizationalEntitiesDomainErrorMappingConfiguration } from '../src/organizational-entities/application/http-error-mapper-configuration.js';
import { prescriptionDomainErrorMappingConfiguration } from '../src/prescription/shared/application/http-error-mapper-configuration.js';
import { stagesDomainErrorMappingConfiguration } from '../src/prescription/stages/application/http-error-mapper-configuration.js';
import { profileDomainErrorMappingConfiguration } from '../src/profile/application/http-error-mapper-configuration.js';
import { schoolDomainErrorMappingConfiguration } from '../src/school/application/http-error-mapper-configuration.js';
import { ErrorHapiManager, ErrorRegistry } from '../src/shared/application/errors/error-manager.js';
import { teamDomainErrorMappingConfiguration } from '../src/team/application/http-error-mapper-configuration.js';

// - Splitter le fichier error-manager.js :
//     - error-registry
//     - error-hapi-manager
//     - error mapping a déplacer dans les bons contextes et shared
// - Revoir la structure des mapping
const setupErrorHandling = function (server) {
  const configuration = [
    ...authenticationDomainErrorMappingConfiguration,
    ...organizationalEntitiesDomainErrorMappingConfiguration,
    ...teamDomainErrorMappingConfiguration,
    ...certificationDomainErrorMappingConfiguration,
    ...devcompDomainErrorMappingConfiguration,
    ...evaluationDomainErrorMappingConfiguration,
    ...stagesDomainErrorMappingConfiguration,
    ...legalDocumentsDomainErrorMappingConfiguration,
    ...prescriptionDomainErrorMappingConfiguration,
    ...schoolDomainErrorMappingConfiguration,
    ...profileDomainErrorMappingConfiguration,
  ];

  const errorRegistry = new ErrorRegistry();
  errorRegistry.register(configuration);

  const errorManager = new ErrorHapiManager(errorRegistry);
  server.ext('onPreResponse', (...args) => errorManager.handle(...args));
};

export { setupErrorHandling };
