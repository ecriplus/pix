import * as challengeToPlayRepository from '../../infrastructure/repositories/challenge-to-play-repository.js';
import * as challengeToPlaySerializer from '../../infrastructure/serializers/jsonapi/challenge-to-play-serializer.js';

async function get(request, h, dependencies = { challengeToPlayRepository, challengeToPlaySerializer }) {
  const challengeToPlay = await dependencies.challengeToPlayRepository.get(request.params.id);
  return dependencies.challengeToPlaySerializer.serialize(challengeToPlay);
}

const challengeController = { get };

export { challengeController };
