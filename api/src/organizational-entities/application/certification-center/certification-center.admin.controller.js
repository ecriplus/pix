import { usecases as libUsecases } from '../../../../lib/domain/usecases/index.js';
import * as certificationCenterForAdminSerializer from '../../../../lib/infrastructure/serializers/jsonapi/certification-center-for-admin-serializer.js';
import { usecases } from '../../domain/usecases/index.js';
import * as certificationCenterSerializer from '../../infrastructure/serializers/jsonapi/certification-center/certification-center.serializer.js';

const create = async function (request) {
  const certificationCenter = certificationCenterForAdminSerializer.deserialize(request.payload);
  const complementaryCertificationIds = request.payload.data.relationships?.habilitations?.data.map(
    (complementaryCertification) => complementaryCertification.id,
  );
  const createdCertificationCenter = await libUsecases.createCertificationCenter({
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

const certificationCenterAdminController = {
  create,
  findPaginatedFilteredCertificationCenters,
};

export { certificationCenterAdminController };
