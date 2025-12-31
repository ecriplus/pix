import { usecases } from '../domain/usecases/index.js';
import * as certificationFrameworkSerializer from '../infrastructure/serializers/certification-framework-serializer.js';
import * as certificationConsolidatedFrameworkSerializer from '../infrastructure/serializers/consolidated-framework-serializer.js';
import * as frameworkHistorySerializer from '../infrastructure/serializers/framework-history-serializer.js';

const findCertificationFrameworks = async function () {
  const frameworks = await usecases.findCertificationFrameworks();
  return certificationFrameworkSerializer.serialize(frameworks);
};

const getActiveConsolidatedFramework = async function (request) {
  const scope = request.params.scope;
  const consolidatedFramework = await usecases.getCurrentFrameworkVersion({
    complementaryCertificationKey: scope,
  });
  return certificationConsolidatedFrameworkSerializer.serialize(consolidatedFramework);
};

const getFrameworkHistory = async function (request) {
  const scope = request.params.scope;

  const frameworkHistory = await usecases.getFrameworkHistory({
    scope,
  });

  return frameworkHistorySerializer.serialize({ scope, frameworkHistory });
};

const certificationFrameworkController = {
  findCertificationFrameworks,
  getActiveConsolidatedFramework,
  getFrameworkHistory,
};

export { certificationFrameworkController };
