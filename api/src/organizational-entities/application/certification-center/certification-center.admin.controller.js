import { usecases as certificationConfigurationUsecases } from '../../../certification/configuration/domain/usecases/index.js';
import { usecases as certificationUsecases } from '../../../certification/enrolment/domain/usecases/index.js';
import { DomainTransaction } from '../../../shared/domain/DomainTransaction.js';
import { usecases } from '../../domain/usecases/index.js';
import * as certificationCenterSerializer from '../../infrastructure/serializers/jsonapi/certification-center/certification-center.serializer.js';
import * as certificationCenterForAdminSerializer from '../../infrastructure/serializers/jsonapi/certification-center/certification-center-for-admin.serializer.js';

const create = async function (request) {
  const certificationCenter = certificationCenterForAdminSerializer.deserialize(request.payload);
  const complementaryCertificationIds =
    request.payload.data.relationships?.habilitations?.data.map(
      (complementaryCertification) => complementaryCertification.id,
    ) || [];
  const createdCertificationCenter = await usecases.createCertificationCenter({
    certificationCenter,
    complementaryCertificationIds,
  });
  return certificationCenterForAdminSerializer.serialize(createdCertificationCenter);
};

const findPaginatedFilteredCertificationCenters = async function (
  request,
  h,
  dependencies = { certificationCenterSerializer },
) {
  const options = request.query;
  const { models: organizations, pagination } = await usecases.findPaginatedFilteredCertificationCenters({
    filter: options.filter,
    page: options.page,
  });

  return dependencies.certificationCenterSerializer.serialize(organizations, pagination);
};

const getCertificationCenterDetails = async function (request) {
  const certificationCenterId = request.params.id;

  const certificationCenterDetails = await certificationUsecases.getCenterForAdmin({ id: certificationCenterId });

  return certificationCenterForAdminSerializer.serialize(certificationCenterDetails);
};

const update = async function (request) {
  const certificationCenterId = request.params.id;
  const certificationCenterInformation = certificationCenterForAdminSerializer.deserialize(request.payload);
  const complementaryCertificationIds =
    request.payload.data.relationships?.habilitations?.data.map(
      (complementaryCertification) => complementaryCertification.id,
    ) || [];

  const { updatedCertificationCenter, certificationCenterPilotFeatures } = await DomainTransaction.execute(
    async () => {
      const updatedCertificationCenter = await usecases.updateCertificationCenter({
        certificationCenterId,
        certificationCenterInformation,
        complementaryCertificationIds,
      });

      const certificationCenterPilotFeatures = await certificationConfigurationUsecases.getCenterPilotFeatures({
        centerId: updatedCertificationCenter.id,
      });

      return { updatedCertificationCenter, certificationCenterPilotFeatures };
    },
    { isolationLevel: 'repeatable read' },
  );

  return certificationCenterForAdminSerializer.serialize(updatedCertificationCenter, certificationCenterPilotFeatures);
};

const certificationCenterAdminController = {
  create,
  findPaginatedFilteredCertificationCenters,
  getCertificationCenterDetails,
  update,
};

export { certificationCenterAdminController };
