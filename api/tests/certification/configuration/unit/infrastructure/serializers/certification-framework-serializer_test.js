import * as certificationFrameworkSerializer from '../../../../../../src/certification/configuration/infrastructure/serializers/certification-framework-serializer.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Certification | Configuration | Serializer | certification-framework-serializer', function () {
  describe('#serialize', function () {
    it('should serialize certification frameworks with their active version start date', function () {
      // given
      const frameworks = [
        { id: 'CORE', name: 'CORE', activeVersionStartDate: new Date('2025-01-15') },
        { id: 'DROIT', name: 'DROIT', activeVersionStartDate: new Date('2025-06-01') },
        { id: 'CLEA', name: 'CLEA', activeVersionStartDate: null },
      ];

      // when
      const serialized = certificationFrameworkSerializer.serialize(frameworks);

      // then
      expect(serialized).to.deep.equal({
        data: [
          {
            type: 'certification-frameworks',
            id: 'CORE',
            attributes: {
              name: 'CORE',
              'active-version-start-date': new Date('2025-01-15'),
            },
          },
          {
            type: 'certification-frameworks',
            id: 'DROIT',
            attributes: {
              name: 'DROIT',
              'active-version-start-date': new Date('2025-06-01'),
            },
          },
          {
            type: 'certification-frameworks',
            id: 'CLEA',
            attributes: {
              name: 'CLEA',
              'active-version-start-date': null,
            },
          },
        ],
      });
    });
  });
  describe('#serializeWithTargetProfilesHistory', function () {
    it('should serialize a certification framework with its target profiles history', function () {
      // given
      const certificationFramework = {
        key: 'DROIT',
        targetProfilesHistory: [
          { id: 1, name: 'Profil A', attachedAt: new Date('2023-01-01'), detachedAt: null },
          { id: 2, name: 'Profil B', attachedAt: new Date('2021-06-15'), detachedAt: new Date('2023-01-01') },
        ],
      };

      // when
      const serialized = certificationFrameworkSerializer.serializeWithTargetProfilesHistory(certificationFramework);

      // then
      expect(serialized).to.deep.equal({
        data: {
          type: 'certification-frameworks',
          id: 'DROIT',
          attributes: {
            name: 'DROIT',
            'target-profiles-history': [
              { id: 1, name: 'Profil A', attachedAt: new Date('2023-01-01'), detachedAt: null },
              { id: 2, name: 'Profil B', attachedAt: new Date('2021-06-15'), detachedAt: new Date('2023-01-01') },
            ],
          },
        },
      });
    });

    it('should serialize with an empty target profiles history when none exist', function () {
      // given
      const certificationFramework = { key: 'DROIT', targetProfilesHistory: null };

      // when
      const serialized = certificationFrameworkSerializer.serializeWithTargetProfilesHistory(certificationFramework);

      // then
      expect(serialized.data.attributes['target-profiles-history']).to.deep.equal([]);
    });
  });
});
