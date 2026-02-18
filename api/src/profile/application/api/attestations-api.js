import { FRENCH_FRANCE } from '../../../shared/domain/services/locale-service.js';
import { usecases } from '../../domain/usecases/index.js';
import * as pdfWithFormSerializer from '../../infrastructure/serializers/pdf/pdf-with-form-serializer.js';

export const generateAttestations = async function ({
  attestationKey,
  userIds,
  organizationId,
  dependencies = { pdfWithFormSerializer },
}) {
  const locale = FRENCH_FRANCE;
  const { data, template } = await usecases.getSharedAttestationsForOrganizationByUserIds({
    attestationKey,
    userIds,
    organizationId,
    locale,
  });

  return dependencies.pdfWithFormSerializer.serializeStream(template, data);
};

export const getAttestationsUserDetail = async function ({ attestationKey, organizationId }) {
  const locale = FRENCH_FRANCE;
  const attestations = await usecases.getSharedAttestationsUserDetailByOrganizationId({
    attestationKey,
    organizationId,
    locale,
  });

  return attestations;
};
