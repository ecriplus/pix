import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (statistics) {
  return new Serializer('campaign-participation-statistics', {
    attributes: ['totalParticipationCount', 'completedParticipationCount', 'sharedParticipationCountLastThirtyDays'],
  }).serialize(statistics);
};

export { serialize };
