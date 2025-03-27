import { getI18n } from '../../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { domainBuilder, expect } from '../../../../../../test-helper.js';

describe('Unit | Domain | Models | GlobalCertificationLevel', function () {
  let translate;

  beforeEach(function () {
    translate = getI18n().__;
  });

  describe('#getLevelLabel', function () {
    it('should return the translated comment matching the LEVEL_BEGINNER_2 label', function () {
      // given
      const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel({ score: 128 });

      // when
      const translatedLabel = globalMeshLevel.getLevelLabel(translate);

      // then
      expect(translatedLabel).to.equal(translate('certification.global.meshlevel.LEVEL_BEGINNER_2.label'));
    });

    it('should return the translated comment matching the maximum reachable level', function () {
      // given
      const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel({ score: 896 });

      // when
      const translatedLabel = globalMeshLevel.getLevelLabel(translate);

      // then
      expect(translatedLabel).to.equal(translate('certification.global.meshlevel.LEVEL_EXPERT_7.label'));
    });

    context('when there is no translation', function () {
      it('should return an empty string', function () {
        // given
        const aScoreWihoutranslation = 0;
        const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel({
          score: aScoreWihoutranslation,
        });

        // when
        const translatedLabel = globalMeshLevel.getLevelLabel(translate);

        // then
        expect(translatedLabel).to.equal('');
      });
    });
  });

  describe('#getSummaryLabel', function () {
    it('should return the translated comment matching the LEVEL_BEGINNER_2 summary', function () {
      // given
      const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel({ score: 128 });

      // when
      const translatedLabel = globalMeshLevel.getSummaryLabel(translate);

      // then
      expect(translatedLabel).to.equal(translate('certification.global.meshlevel.LEVEL_BEGINNER_2.summary'));
    });

    it('should return the translated comment matching the maximum reachable level', function () {
      // given
      const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel({ score: 896 });

      // when
      const translatedLabel = globalMeshLevel.getSummaryLabel(translate);

      // then
      expect(translatedLabel).to.equal(translate('certification.global.meshlevel.LEVEL_EXPERT_7.summary'));
    });

    context('when there is no translation', function () {
      it('should return an empty string', function () {
        // given
        const aScoreWihoutranslation = 0;
        const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel({
          score: aScoreWihoutranslation,
        });

        // when
        const translatedLabel = globalMeshLevel.getSummaryLabel(translate);

        // then
        expect(translatedLabel).to.equal('');
      });
    });
  });

  describe('#getDescriptionLabel', function () {
    it('should return the translated comment matching the LEVEL_BEGINNER_2 description', function () {
      // given
      const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel({ score: 128 });

      // when
      const translatedLabel = globalMeshLevel.getDescriptionLabel(translate);

      // then
      expect(translatedLabel).to.equal(translate('certification.global.meshlevel.LEVEL_BEGINNER_2.description'));
    });

    it('should return the translated comment matching the maximum reachable level', function () {
      // given
      const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel({ score: 896 });

      // when
      const translatedLabel = globalMeshLevel.getDescriptionLabel(translate);

      // then
      expect(translatedLabel).to.equal(translate('certification.global.meshlevel.LEVEL_EXPERT_7.description'));
    });

    context('when there is no translation', function () {
      it('should return an empty string', function () {
        // given
        const aScoreWihoutranslation = 0;
        const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel({
          score: aScoreWihoutranslation,
        });

        // when
        const translatedLabel = globalMeshLevel.getDescriptionLabel(translate);

        // then
        expect(translatedLabel).to.equal('');
      });
    });
  });
});
