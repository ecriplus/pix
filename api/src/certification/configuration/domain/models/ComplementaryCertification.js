import { ComplementaryCertificationKeys } from '../../../shared/domain/models/ComplementaryCertificationKeys.js';

export class ComplementaryCertification {
  constructor({ id, label, key }) {
    this.id = id;
    this.label = label;
    this.key = key;
    this.hasComplementaryReferential = key !== ComplementaryCertificationKeys.CLEA;
  }
}
