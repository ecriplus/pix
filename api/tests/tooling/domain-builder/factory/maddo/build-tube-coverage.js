import { TubeCoverage } from '../../../../../src/maddo/domain/models/TubeCoverage.js';

export function buildTubeCoverage({
  id,
  competenceId,
  maxLevel,
  reachedLevel,
  practicalDescription,
  practicalTitle,
} = {}) {
  return new TubeCoverage({
    id,
    competenceId,
    maxLevel,
    reachedLevel,
    practicalDescription,
    practicalTitle,
  });
}
