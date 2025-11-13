import { usecases } from '../domain/usecases/index.js';
import { serialize } from '../infrastructure/serializers/sco-blocked-access-dates-serializer.js';

const updateScoBlockedAccessDate = async function (request, h) {
  const scoOrganizationType = request.params.key;
  const reopeningDate = request.payload.data.attributes.value;
  await usecases.updateScoBlockedAccessDate({ scoOrganizationType, reopeningDate });
  return h.response().code(201);
};

const getScoBlockedAccessDates = async function (request, h) {
  const scoBlockedAccessDates = await usecases.getScoBlockedAccessDates();

  return h.response(await serialize(scoBlockedAccessDates)).code(200);
};

export const scoBlockedAccessDatesController = {
  updateScoBlockedAccessDate,
  getScoBlockedAccessDates,
};
