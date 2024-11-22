import * as challengeRepository from '../../shared/infrastructure/repositories/challenge-repository.js';
import { usecases } from '../domain/usecases/index.js';
import * as challengeSerializer from '../infrastructure/serializers/challenge-serializer.js';

const get = async function (request, h, dependencies = { challengeRepository, challengeSerializer }) {
  const challenge = await usecases.getChallenge({ id: request.params.id });
  return dependencies.challengeSerializer.serialize(challenge);
};

const challengeController = { get };

export { challengeController };
