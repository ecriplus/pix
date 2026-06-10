import { Serializer } from 'jsonapi-serializer';
// todo delete me
const serialize = function (enrolledCandidates) {
  return new Serializer('certification-candidate', {
    attributes: ['firstName', 'lastName', 'birthdate', 'subscription'],
  }).serialize(enrolledCandidates);
};

export { serialize };
