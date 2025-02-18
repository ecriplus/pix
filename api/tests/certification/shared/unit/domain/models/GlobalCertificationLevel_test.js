import { GlobalCertificationLevel } from '../../../../../../src/certification/shared/domain/models/GlobalCertificationLevel.js';
import { getI18n } from '../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Domain | Models | GlobalCertificationLevel', function () {
  let translate;

  beforeEach(function () {
    translate = getI18n().__;
  });

  describe('#getLevelLabel', function () {
    it('should return the translated comment matching the key', function () {
      // given
      const globalMeshLevel = new GlobalCertificationLevel({ meshLevel: 0 });

      // when
      const translatedLabel = globalMeshLevel.getLevelLabel(translate);

      // then
      expect(translatedLabel).to.equal(translate('certification.global.meshlevel.0'));
    });
  });
});
