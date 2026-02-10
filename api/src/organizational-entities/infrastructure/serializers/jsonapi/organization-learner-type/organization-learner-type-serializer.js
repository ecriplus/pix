import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (organizationLearnerType) {
  return new Serializer('organization-learner-type', {
    attributes: ['name'],
  }).serialize(organizationLearnerType);
};

export { serialize };
