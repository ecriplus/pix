import { usecases } from '../domain/usecases/index.js';
import * as attachableTargetProfilesSerializer from '../infrastructure/serializers/attachable-target-profiles-serializer.js';
import * as complementaryCertificationSerializer from '../infrastructure/serializers/complementary-certification-serializer.js';

const findComplementaryCertifications = async function () {
  const complementaryCertifications = await usecases.findComplementaryCertifications();
  return complementaryCertificationSerializer.serialize(complementaryCertifications);
};

const searchAttachableTargetProfilesForComplementaryCertifications = async function (request) {
  const searchTerm = request.query.searchTerm;
  const attachableTargetProfiles = await usecases.searchAttachableTargetProfiles({ searchTerm });
  return attachableTargetProfilesSerializer.serialize(attachableTargetProfiles);
};

const createCertificationVersion = async function (request, h) {
  const { complementaryCertificationKey } = request.params;
  const { tubeIds } = request.payload.data.attributes;

  await usecases.createCertificationVersion({ scope: complementaryCertificationKey, tubeIds });

  return h
    .response({
      data: {
        id: complementaryCertificationKey,
        type: 'certification-consolidated-framework',
      },
    })
    .code(201);
};

const calibrateFrameworkVersion = async function (request, h) {
  const { versionId, calibrationId } = request.payload.data.attributes;
  await usecases.calibrateFrameworkVersion({ versionId, calibrationId });

  return h.response().code(200);
};

const getComplementaryCertificationTargetProfileHistory = async function (request) {
  const complementaryCertificationKey = request.params.complementaryCertificationKey;
  const complementaryCertification = await usecases.getComplementaryCertificationTargetProfileHistory({
    complementaryCertificationKey,
  });
  return complementaryCertificationSerializer.serializeForAdmin(complementaryCertification);
};

const complementaryCertificationController = {
  calibrateFrameworkVersion,
  createCertificationVersion,
  findComplementaryCertifications,
  getComplementaryCertificationTargetProfileHistory,
  searchAttachableTargetProfilesForComplementaryCertifications,
};
export { complementaryCertificationController };
