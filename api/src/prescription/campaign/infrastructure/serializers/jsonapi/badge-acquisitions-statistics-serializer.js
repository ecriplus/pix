import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = (model) =>
  new Serializer('badge-acquisitions-statistics', {
    id: 'campaignId',
    attributes: ['data'],
    data: {
      attributes: ['badge', 'count', 'percentage'],
    },
  }).serialize(model);

export { serialize };
