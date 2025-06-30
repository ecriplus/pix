import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (verifiedCode) {
  return new Serializer('verified-codes', {
    attributes: ['campaign'],
    campaign: {
      ref: 'id',
      ignoreRelationshipData: true,
      nullIfMissing: true,
      relationshipLinks: {
        related: function (record, current, verifiedCode) {
          return `/api/campaigns?filter[code]=${verifiedCode.id}`;
        },
      },
    },
  }).serialize(verifiedCode);
};

export { serialize };
