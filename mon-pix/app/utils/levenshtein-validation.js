import levenshtein from 'fast-levenshtein';
import includes from 'lodash/includes';

const LEVENSHTEIN_DISTANCE_MAX_RATE = 0.25;

function useLevenshteinRatio(enabledTolerances) {
  return includes(enabledTolerances, 't3');
}

function areApproximatelyEqualAccordingToLevenshteinDistanceRatio(answer, solutionVariants) {
  let smallestLevenshteinDistance = answer.length;
  for (const variant of solutionVariants) {
    const levenshteinDistance = levenshtein.get(answer, variant);
    smallestLevenshteinDistance = Math.min(smallestLevenshteinDistance, levenshteinDistance);
  }
  const ratio = smallestLevenshteinDistance / answer.length;
  return ratio <= LEVENSHTEIN_DISTANCE_MAX_RATE;
}

export { areApproximatelyEqualAccordingToLevenshteinDistanceRatio, useLevenshteinRatio };
