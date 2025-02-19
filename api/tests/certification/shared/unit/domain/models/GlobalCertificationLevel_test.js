import { getI18n } from '../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { domainBuilder, expect } from '../../../../../test-helper.js';

describe('Unit | Domain | Models | GlobalCertificationLevel', function () {
  let translate;

  beforeEach(function () {
    translate = getI18n().__;
  });

  describe('#getLevelLabel', function () {
    it('should return the translated comment matching the key', function () {
      // given
      const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel();

      // when
      const translatedLabel = globalMeshLevel.getLevelLabel(translate);

      // then
      expect(translatedLabel).to.equal(translate('certification.global.meshlevel.1'));
    });

    context('when there is no translation', function () {
      it('should return an empty string', function () {
        // given
        const aMeshLevelWihoutranslation = 0;
        const globalMeshLevel = domainBuilder.certification.results.buildGlobalCertificationLevel({
          meshLevel: aMeshLevelWihoutranslation,
        });

        // when
        const translatedLabel = globalMeshLevel.getLevelLabel(translate);

        // then
        expect(translatedLabel).to.equal('');
      });
    });
  });
});
