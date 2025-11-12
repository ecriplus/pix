import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (scoBlockedAccessDates) {
  return new Serializer('sco-blocked-access-dates', {
    transform() {
      return { dates: scoBlockedAccessDates };
    },
    attributes: ['dates'],
  }).serialize({});
};

export { serialize };
