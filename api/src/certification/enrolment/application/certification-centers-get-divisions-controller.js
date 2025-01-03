import * as divisionSerializer from '../../../prescription/campaign/infrastructure/serializers/jsonapi/division-serializer.js';
import { usecases } from '../domain/usecases/index.js';

const getDivisions = async function (request) {
  const certificationCenterId = request.params.certificationCenterId;
  const divisions = await usecases.findDivisionsByCertificationCenter({
    certificationCenterId,
  });

  return divisionSerializer.serialize(divisions);
};

const certificationCenterController = { getDivisions };

export { certificationCenterController };
