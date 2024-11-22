export async function getChallenge({ id, challengeRepository }) {
  return challengeRepository.get(id);
}
