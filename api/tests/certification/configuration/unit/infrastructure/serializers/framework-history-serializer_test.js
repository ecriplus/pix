import * as serializer from '../../../../../../src/certification/configuration/infrastructure/serializers/framework-history-serializer.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { expect } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | Serializer | framework-history-serializer', function () {
  describe('#serialize', function () {
    it('should serialize a framework history to JSONAPI', function () {
      // given
      const frameworkHistory = [{ id: 456, startDate: new Date('2024-01-01'), expirationDate: new Date('2025-02-02') }];
      const complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT;

      // when
      const serializedFrameworkHistory = serializer.serialize({ complementaryCertificationKey, frameworkHistory });

      // then
      expect(serializedFrameworkHistory).to.deep.equal({
        data: {
          attributes: {
            'complementary-certification-key': ComplementaryCertificationKeys.PIX_PLUS_DROIT,
            history: frameworkHistory,
          },
          id: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
          type: 'framework-histories',
        },
      });
    });
  });
});
