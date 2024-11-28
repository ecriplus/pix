import * as serializer from '../../../../../../src/certification/flash-certification/infrastructure/serializers/flash-algorithm-configuration-serializer.js';
import { FlashAssessmentAlgorithmConfiguration } from '../../../../../../src/certification/shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Certification | flash-certification | Serializer | flash-algorithm-configuration-serializer', function () {
  describe('#serialize()', function () {
    it('should convert a FlashAssessmentAlgorithmConfiguration model object into correct JSON API data', function () {
      // given
      const expectedJsonApi = {
        data: {
          id: '0',
          type: 'flash-algorithm-configurations',
          attributes: {
            'forced-competences': 2,
            'maximum-assessment-length': 3,
            'challenges-between-same-competence': 4,
            'variation-percent': 6,
            'variation-percent-until': 7,
            'limit-to-one-question-per-tube': false,
            'enable-passage-by-all-competences': true,
          },
        },
      };

      const flashAlgorithmConfiguration = new FlashAssessmentAlgorithmConfiguration({
        forcedCompetences: 2,
        maximumAssessmentLength: 3,
        challengesBetweenSameCompetence: 4,
        variationPercent: 6,
        variationPercentUntil: 7,
        limitToOneQuestionPerTube: false,
        enablePassageByAllCompetences: true,
      });

      // when
      const json = serializer.serialize({ flashAlgorithmConfiguration });

      // then
      expect(json).to.deep.equal(expectedJsonApi);
    });
  });
});
