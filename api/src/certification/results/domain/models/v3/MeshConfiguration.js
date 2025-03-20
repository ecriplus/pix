import { config } from '../../../../../shared/config.js';

export class MeshConfiguration {
  /**
   * @typedef {Object} Mesh
   * @property {number} weight - every mesh gives a certain number of pix, called weight
   * @property {nulber} coefficient - the higher the capacity associated to a mesh, the higher the coefficient
   */

  /**
   * Mesh represents the breakdown of candidates level
   * @readonly
   * @enum {Map<String, Mesh>}
   */
  MESH_CONFIGURATION = new Map([
    ['PRE_BEGINNER', { weight: 64, coefficient: 0 }],
    ['BEGINNER_1', { weight: 64, coefficient: 1 }],
    ['BEGINNER_2', { weight: 128, coefficient: 1 }],
    ['INDEPENDENT_1', { weight: 128, coefficient: 2 }],
    ['INDEPENDENT_2', { weight: 128, coefficient: 3 }],
    ['ADVANCED_1', { weight: 128, coefficient: 4 }],
    ['ADVANCED_2', { weight: 128, coefficient: 5 }],
    ['EXPERT_1', { weight: 128, coefficient: 6 }],
    ['EXPERT_2', { weight: 128, coefficient: 7 }],
  ]);

  #MAX_REACHABLE_LEVEL = config.v3Certification.maxReachableLevel;

  findIntervalIndexFromScore({ score }) {
    const meshConfs = this.MESH_CONFIGURATION.values();
    let cumulativeSumOfWeights = meshConfs.next().value.weight;
    let currentScoringInterval = 0;

    while (this.#hasNextScoringInterval(score, cumulativeSumOfWeights, currentScoringInterval)) {
      currentScoringInterval++;
      cumulativeSumOfWeights += meshConfs.next().value.weight;
    }

    return currentScoringInterval;
  }

  #hasNextScoringInterval(score, nextIntervalMinimumScore, currentInterval) {
    return score >= nextIntervalMinimumScore && currentInterval < this.#MAX_REACHABLE_LEVEL;
  }
}

export const meshConfiguration = new MeshConfiguration();
