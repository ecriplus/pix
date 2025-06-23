import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (organizations) {
  return new Serializer('organizations-to-join', {
    pluralizeType: false,
    attributes: ['id', 'name', 'type', 'logoUrl', 'isRestricted', 'identityProvider', 'reconciliationFields'],
    reconciliationFields: {
      attributes: ['name', 'fieldId', 'position', 'type'],
    },
  }).serialize(organizations);
};

export { serialize };
