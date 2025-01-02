import { usecases } from '../domain/usecases/index.js';

const getCertificationResult = async function (request) {
  const ine = request.params.ine;
  return usecases.getCertificationResult({ ine, ...request.query });
};

const certificationController = {
  getCertificationResult,
};
export { certificationController };
