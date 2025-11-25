import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

export const serialize = function (scoBlockedAccessDate) {
  return new Serializer('sco-blocked-access-dates', {
    attributes: ['reopeningDate'],
    transform: (record) => {
      return {
        ...record,
        id: record.scoOrganizationTagName,
      };
    },
  }).serialize(scoBlockedAccessDate);
};
