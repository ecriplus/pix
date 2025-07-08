import { usecases as certificationConfigurationUsecases } from '../../../../../src/certification/configuration/domain/usecases/index.js';
import ComplementaryCertificationTubes from './complementary-certification-challenges.js';

export class ComplementaryCertificationSeed {
  constructor({ databaseBuilder }) {
    this.databaseBuilder = databaseBuilder;
  }

  async create() {
    const tubeIds = ComplementaryCertificationTubes[0].tubeIds;
    const complementaryCertificationKey = ComplementaryCertificationTubes[0].complementaryCertificationKey;
    certificationConfigurationUsecases.createConsolidatedFramework({ complementaryCertificationKey, tubeIds });
  }
}
