import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (statistics) {
  return new Serializer('organization-participation-statistics', {
    attributes: ['totalParticipationCount', 'completedParticipationCount'],
  }).serialize(statistics);
};

export { serialize };
