import { usecases as certificationConfigurationUsecases } from '../../../../../src/certification/configuration/domain/usecases/index.js';
import { complementaryCertifications } from './complementary-certifications.js';

export class ComplementaryCertificationSeed {
  constructor({ databaseBuilder }) {
    this.databaseBuilder = databaseBuilder;
  }

  async create() {
    const tubeIds = complementaryCertifications[0].tubeIds;
    const complementaryCertificationKey = complementaryCertifications[0].complementaryCertificationKey;
    certificationConfigurationUsecases.createConsolidatedFramework({ complementaryCertificationKey, tubeIds });
  }
}
