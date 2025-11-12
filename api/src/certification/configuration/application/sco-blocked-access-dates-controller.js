import { usecases } from '../domain/usecases/index.js';
import { serialize } from '../infrastructure/serializers/sco-blocked-access-dates-serializer.js';

const updateScoBlockedAccessDates = async function (request, h) {
  const key = request.params;
  const value = request.payload.data.attributes;
  await usecases.updateScoBlockedAccessDates({ key, value });
  return h.response().code(200);
};

const getScoBlockedAccessDates = async function (request, h) {
  const scoBlockedAccessDates = await usecases.getScoBlockedAccessDates();

  return h.response(await serialize(scoBlockedAccessDates)).code(200);
};

export const scoBlockedAccessDatesController = {
  updateScoBlockedAccessDates,
  getScoBlockedAccessDates,
};
