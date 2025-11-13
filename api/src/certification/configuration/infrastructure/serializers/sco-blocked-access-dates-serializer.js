import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

export const serialize = function (scoBlockedAccessDate) {
  return new Serializer('sco-blocked-access-dates', {
    attributes: ['scoOrganizationType', 'reopeningDate'],
    keyForAttribute: 'camelCase',
  }).serialize(scoBlockedAccessDate);
};
