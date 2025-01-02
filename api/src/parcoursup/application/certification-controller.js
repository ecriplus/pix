import { usecases } from '../domain/usecases/index.js';

const getCertificationResult = async function (request) {
  return usecases.getCertificationResult(request.query);
};

const certificationController = {
  getCertificationResult,
};
export { certificationController };
