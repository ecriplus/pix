import * as challengeRepository from '../../../shared/infrastructure/repositories/challenge-repository.js';
import * as challengeSerializer from '../../../shared/infrastructure/serializers/jsonapi/challenge-serializer.js';

async function get(request, h, dependencies = { challengeRepository, challengeSerializer }) {
  const challenge = await dependencies.challengeRepository.get(request.params.id);
  return dependencies.challengeSerializer.serialize(challenge);
}

const challengeController = { get };

export { challengeController };
