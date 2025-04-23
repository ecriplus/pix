import { config } from '../../../../../shared/config.js';
import { CERTIFICATE_LEVELS } from './CertificateLevels.js';

export class MeshConfiguration {
  /**
   * @typedef {Object} Mesh
   * @property {number} weight - every mesh gives a certain number of pix, called weight
   * @property {number} coefficient - the higher the capacity associated to a mesh, the higher the coefficient
   */

  /**
   * Mesh represents the breakdown of candidates level
   * @readonly
   * @enum {Map<String, Mesh>}
   */
  MESH_CONFIGURATION = new Map([
    [CERTIFICATE_LEVELS.preBeginner, { weight: 64, coefficient: 0 }],
    [CERTIFICATE_LEVELS.beginner1, { weight: 64, coefficient: 1 }],
    [CERTIFICATE_LEVELS.beginner2, { weight: 128, coefficient: 1 }],
    [CERTIFICATE_LEVELS.independent3, { weight: 128, coefficient: 2 }],
    [CERTIFICATE_LEVELS.independent4, { weight: 128, coefficient: 3 }],
    [CERTIFICATE_LEVELS.advanced5, { weight: 128, coefficient: 4 }],
    [CERTIFICATE_LEVELS.advanced6, { weight: 128, coefficient: 5 }],
    [CERTIFICATE_LEVELS.expert7, { weight: 128, coefficient: 6 }],
    [CERTIFICATE_LEVELS.expert8, { weight: 128, coefficient: 7 }],
  ]);

  #MAX_REACHABLE_LEVEL = config.v3Certification.maxReachableLevel;

  getMesh(meshKey) {
    return this.MESH_CONFIGURATION.get(meshKey);
  }

  /**
   * @returns {{key: string, value: Mesh}}
   */
  findMeshFromScore({ score }) {
    const configuration = this.MESH_CONFIGURATION.entries();
    let currentMesh = configuration.next();
    let cumulativeSumOfWeights = currentMesh.value[1].weight;
    let currentScoringInterval = 0;

    while (this.#hasNextScoringInterval(score, cumulativeSumOfWeights, currentScoringInterval)) {
      currentScoringInterval++;
      currentMesh = configuration.next();
      cumulativeSumOfWeights += currentMesh.value[1].weight;
    }

    return { key: currentMesh.value[0], value: currentMesh.value[1] };
  }

  /**
   * @deprecated please use {@link MeshConfiguration#findMeshFromScore}
   */
  findIntervalIndexFromScore({ score }) {
    const configuration = this.MESH_CONFIGURATION.values();
    let cumulativeSumOfWeights = configuration.next().value.weight;
    let currentScoringInterval = 0;

    while (this.#hasNextScoringInterval(score, cumulativeSumOfWeights, currentScoringInterval)) {
      currentScoringInterval++;
      cumulativeSumOfWeights += configuration.next().value.weight;
    }

    return currentScoringInterval;
  }

  #hasNextScoringInterval(score, nextIntervalMinimumScore, currentInterval) {
    return score >= nextIntervalMinimumScore && currentInterval < this.#MAX_REACHABLE_LEVEL;
  }
}

export const meshConfiguration = new MeshConfiguration();
