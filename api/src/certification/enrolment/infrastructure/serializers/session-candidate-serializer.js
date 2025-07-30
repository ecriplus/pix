import { Serializer } from 'jsonapi-serializer';

const serialize = function (enrolledCandidates) {
  return new Serializer('certification-candidate', {
    attributes: ['firstName', 'lastName', 'birthdate', 'subscriptions'],
    subscriptions: {
      include: true,
      ref: 'id',
      attributes: ['complementaryCertificationKey', 'type'],
    },
  }).serialize(enrolledCandidates);
};

export { serialize };
