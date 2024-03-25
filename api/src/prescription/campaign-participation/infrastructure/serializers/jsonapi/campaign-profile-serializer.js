import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (campaignProfile) {
  return new Serializer('campaign-profiles', {
    id: 'campaignParticipationId',
    attributes: [
      'firstName',
      'lastName',
      'externalId',
      'createdAt',
      'sharedAt',
      'isShared',
      'campaignId',
      'pixScore',
      'competencesCount',
      'certifiableCompetencesCount',
      'isCertifiable',
      'competences',
      'organizationLearnerId',
    ],
    typeForAttribute: (attribute) => {
      if (attribute === 'competences') return 'campaign-profile-competences';
    },
    competences: {
      ref: 'id',
      attributes: ['name', 'index', 'pixScore', 'estimatedLevel', 'areaColor'],
    },
  }).serialize(campaignProfile);
};

export { serialize };