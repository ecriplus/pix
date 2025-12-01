import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

import { usecases } from '../domain/usecases/index.js';
import { serialize } from '../infrastructure/serializers/sco-blocked-access-dates-serializer.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const updateScoBlockedAccessDate = async function (request, h) {
  const scoOrganizationTagName = request.params.key;
  const dateString = request.payload.data.attributes.value;
  const reopeningDate = dayjs.tz(dateString, 'Europe/Paris').toDate();
  await usecases.updateScoBlockedAccessDate({ scoOrganizationTagName, reopeningDate });
  return h.response().code(200);
};

const getScoBlockedAccessDates = async function (request, h) {
  const scoBlockedAccessDates = await usecases.getScoBlockedAccessDates();

  return h.response(await serialize(scoBlockedAccessDates)).code(200);
};

export const scoBlockedAccessDatesController = {
  updateScoBlockedAccessDate,
  getScoBlockedAccessDates,
};
