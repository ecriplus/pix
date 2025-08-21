import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (filteredOrganizations, meta) {
  return new Serializer('training-target-profile-organizations', {
    attributes: ['name', 'externalId', 'isExcluded', 'type', 'organizationId'],
    meta,
  }).serialize(filteredOrganizations);
};

export { serialize };
