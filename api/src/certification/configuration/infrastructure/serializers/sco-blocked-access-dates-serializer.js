import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (ScoBlockedAccessDates) {
  return new Serializer('sco-blocked-access-dates', {
    attributes: ['scoBlockedAccessDateLycee', 'scoBlockedAccessDateCollege'],
  }).serialize(ScoBlockedAccessDates);
};

export { serialize };
