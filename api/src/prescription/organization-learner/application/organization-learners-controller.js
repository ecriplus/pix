import { NoProfileRewardsFoundError } from '../../../profile/domain/errors.js';
import { usecases } from '../domain/usecases/index.js';
import * as analysisByTubesSerializer from '../infrastructure/serializers/jsonapi/analysis-by-tubes-serializer.js';
import * as attestationParticipantStatusSerializer from '../infrastructure/serializers/jsonapi/attestation-participants-status-serializer.js';

const getAttestationZipForDivisions = async function (request, h) {
  const organizationId = request.params.organizationId;
  const attestationKey = request.params.attestationKey;
  const divisions = request.query.divisions;

  try {
    const buffer = await usecases.getAttestationZipForDivisions({ attestationKey, organizationId, divisions });
    return h.response(buffer).header('Content-Type', 'application/zip');
  } catch (error) {
    if (error instanceof NoProfileRewardsFoundError) {
      return h.response().code(204);
    }
    throw error;
  }
};

const getAnalysisByTubes = async function (request, h, dependencies = { analysisByTubesSerializer }) {
  const organizationId = request.params.organizationId;
  const result = await usecases.getAnalysisByTubes({ organizationId });
  const serializedResult = dependencies.analysisByTubesSerializer.serialize({ data: result });
  return h.response(serializedResult).code(200);
};

const getAttestationParticipantsStatus = async function (
  request,
  h,
  dependencies = { attestationParticipantStatusSerializer },
) {
  const { organizationId, attestationKey } = request.params;
  const { filter, page } = request.query;
  const result = await usecases.findPaginatedFilteredAttestationParticipantsStatus({
    attestationKey,
    organizationId,
    filter,
    page,
  });
  return h.response(dependencies.attestationParticipantStatusSerializer.serialize(result)).code(200);
};

const organizationLearnersController = {
  getAnalysisByTubes,
  getAttestationZipForDivisions,
  getAttestationParticipantsStatus,
};

export { organizationLearnersController };
