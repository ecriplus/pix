import { expect } from 'chai';

import * as serializer from '../../../../../../src/certification/configuration/infrastructure/serializers/certification-version-detail-serializer.js';
import { domainBuilder } from '../../../../../tooling/domain-builder/domain-builder.js';

describe('Certification | Configuration | Unit | Serializer | certification-version-detail-serializer', function () {
  describe('#serialize', function () {
    it('should serialize a version with areas to JSONAPI format', function () {
      // given
      const version = domainBuilder.certification.configuration.buildVersion({
        id: 42,
        startDate: new Date('2024-01-01T00:00:00Z'),
        expirationDate: new Date('2025-12-31T00:00:00Z'),
        assessmentDuration: 105,
        minimumAnswersRequiredToValidateACertification: 20,
        challengesConfiguration: { maximumAssessmentLength: 32 },
        comments: 'some good comments',
      });

      const area = domainBuilder.buildArea({
        competences: [domainBuilder.buildCompetence({ tubes: [domainBuilder.buildTube()] })],
      });

      // when
      const result = serializer.serialize({ version, areas: [area] });

      // then
      expect(result.data).to.deep.include({
        id: '42',
        type: 'certification-versions',
        attributes: {
          'start-date': new Date('2024-01-01T00:00:00Z'),
          'expiration-date': new Date('2025-12-31T00:00:00Z'),
          'assessment-duration': 105,
          'minimum-answers-required-for-validation': 20,
          'maximum-assessment-length': 32,
          comments: 'some good comments',
        },
      });
      expect(result.data.relationships.areas.data).to.deep.equal([{ id: area.id, type: 'areas' }]);
      expect(result.included.some((item) => item.type === 'areas' && item.id === area.id)).to.be.true;
    });
  });
});
