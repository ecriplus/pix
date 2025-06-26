import { expect } from 'chai';

import { ConsolidatedFramework } from '../../../../../../src/certification/configuration/domain/models/ConsolidatedFramework.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';

describe('Certification | Configuration | Unit | Domain | Models | ConsolidatedFramework', function () {
  it('should create a consolidated framework', function () {
    // given
    const createdAt = new Date();

    // when
    const consolidatedFramework = new ConsolidatedFramework({
      complementaryCertificationKey: ComplementaryCertificationKeys.PIX_PLUS_PRO_SANTE,
      createdAt,
    });

    // then
    expect(consolidatedFramework).to.deep.equal({
      complementaryCertificationKey: ComplementaryCertificationKeys.PIX_PLUS_PRO_SANTE,
      createdAt,
      calibrationId: undefined,
      challenges: [],
    });
  });
});
