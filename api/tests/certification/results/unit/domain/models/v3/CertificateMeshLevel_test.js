import {
  CertificateMeshLevel,
  CORE_LEVELS,
  EDU_LEVELS,
} from '../../../../../../../src/certification/results/domain/models/v3/CertificateMeshLevel.js';
import { Frameworks } from '../../../../../../../src/certification/shared/domain/models/Frameworks.js';
import { getI18n } from '../../../../../../../src/shared/infrastructure/i18n/i18n.js';
import { expect } from '../../../../../../test-helper.js';
import { domainBuilder } from '../../../../../../tooling/domain-builder/domain-builder.js';

describe('Unit | Domain | Models | CertificateMeshLevel', function () {
  let translate;

  beforeEach(function () {
    translate = getI18n().__;
  });

  describe('when the scope is CORE', function () {
    it('should return the corresponding mesh level', async function () {
      // when
      const globalCertificationLevel = new CertificateMeshLevel({
        reachedMeshIndex: 2,
        certificationFramework: Frameworks.CORE,
      });

      // then
      expect(globalCertificationLevel.meshLevel).to.equal(CORE_LEVELS['2']);
    });
  });

  describe('when the scope is EDU', function () {
    describe('when the reached mesh index is null', function () {
      it('should return a null mesh level', async function () {
        // when
        const globalCertificationLevel = new CertificateMeshLevel({
          reachedMeshIndex: null,
          certificationFramework: Frameworks.EDU_1ER_DEGRE,
        });

        // then
        expect(globalCertificationLevel.meshLevel).to.equal(null);
      });
    });

    describe('when the reached mesh index is at least O', function () {
      it('should return the corresponding mesh level', async function () {
        // when
        const globalCertificationLevel = new CertificateMeshLevel({
          reachedMeshIndex: 0,
          certificationFramework: Frameworks.EDU_CPE,
        });

        // then
        expect(globalCertificationLevel.meshLevel).to.equal(EDU_LEVELS['0']);
      });
    });
  });

  describe('#getLevelLabel', function () {
    context('when certificationFramework is CORE', function () {
      it('should return the label for LEVEL_BEGINNER_2', function () {
        // given
        const globalMeshLevel = domainBuilder.certification.results.buildCertificateMeshLevel({
          reachedMeshIndex: 2,
          certificationFramework: Frameworks.CORE,
        });

        // when
        const translatedLabel = globalMeshLevel.getLevelLabel(translate);

        // then
        expect(translatedLabel).to.equal(translate('certification.meshlevel.CORE.LEVEL_BEGINNER_2.label'));
      });

      it('should return the label for LEVEL_EXPERT_7', function () {
        // given
        const globalMeshLevel = domainBuilder.certification.results.buildCertificateMeshLevel({
          reachedMeshIndex: 7,
          certificationFramework: Frameworks.CORE,
        });

        // when
        const translatedLabel = globalMeshLevel.getLevelLabel(translate);

        // then
        expect(translatedLabel).to.equal(translate('certification.meshlevel.CORE.LEVEL_EXPERT_7.label'));
      });

      it('should return an empty string when there is no translation (LEVEL_PRE_BEGINNER)', function () {
        // given
        const globalMeshLevel = domainBuilder.certification.results.buildCertificateMeshLevel({
          reachedMeshIndex: 0,
          certificationFramework: Frameworks.CORE,
        });

        // when
        const translatedLabel = globalMeshLevel.getLevelLabel(translate);

        // then
        expect(translatedLabel).to.equal('');
      });
    });

    context('when certificationFramework is CLEA', function () {
      it('should return the same label as CORE for LEVEL_BEGINNER_2', function () {
        // given
        const globalMeshLevel = domainBuilder.certification.results.buildCertificateMeshLevel({
          reachedMeshIndex: 2,
          certificationFramework: Frameworks.CLEA,
        });

        // when
        const translatedLabel = globalMeshLevel.getLevelLabel(translate);

        // then
        expect(translatedLabel).to.equal(translate('certification.meshlevel.CORE.LEVEL_BEGINNER_2.label'));
      });
    });

    context('when certificationFramework is EDU', function () {
      it('should return the label for LEVEL_ADMISSIBLE', function () {
        // given
        const globalMeshLevel = domainBuilder.certification.results.buildCertificateMeshLevel({
          reachedMeshIndex: 0,
          certificationFramework: Frameworks.EDU_1ER_DEGRE,
        });

        // when
        const translatedLabel = globalMeshLevel.getLevelLabel(translate);

        // then
        expect(translatedLabel).to.equal(translate('certification.meshlevel.EDU_1ER_DEGRE.LEVEL_ADMISSIBLE.label'));
      });
    });
  });

  describe('#getSummaryLabel', function () {
    context('when certificationFramework is CORE', function () {
      it('should return the summary for LEVEL_BEGINNER_2', function () {
        // given
        const globalMeshLevel = domainBuilder.certification.results.buildCertificateMeshLevel({
          reachedMeshIndex: 2,
          certificationFramework: Frameworks.CORE,
        });

        // when
        const translatedLabel = globalMeshLevel.getSummaryLabel(translate);

        // then
        expect(translatedLabel).to.equal(translate('certification.meshlevel.CORE.LEVEL_BEGINNER_2.summary'));
      });
    });

    context('when certificationFramework is EDU', function () {
      it('should return the summary for LEVEL_ADMISSIBLE', function () {
        // given
        const globalMeshLevel = domainBuilder.certification.results.buildCertificateMeshLevel({
          reachedMeshIndex: 0,
          certificationFramework: Frameworks.EDU_1ER_DEGRE,
        });

        // when
        const translatedLabel = globalMeshLevel.getSummaryLabel(translate);

        // then
        expect(translatedLabel).to.equal(translate('certification.meshlevel.EDU_1ER_DEGRE.LEVEL_ADMISSIBLE.summary'));
      });
    });
  });

  describe('#getDescriptionLabel', function () {
    context('when certificationFramework is CORE', function () {
      it('should return the description for LEVEL_BEGINNER_2', function () {
        // given
        const globalMeshLevel = domainBuilder.certification.results.buildCertificateMeshLevel({
          reachedMeshIndex: 2,
          certificationFramework: Frameworks.CORE,
        });

        // when
        const translatedLabel = globalMeshLevel.getDescriptionLabel(translate);

        // then
        expect(translatedLabel).to.equal(translate('certification.meshlevel.CORE.LEVEL_BEGINNER_2.description'));
      });
    });

    context('when certificationFramework is EDU', function () {
      it('should return the description for LEVEL_ADMISSIBLE', function () {
        // given
        const globalMeshLevel = domainBuilder.certification.results.buildCertificateMeshLevel({
          reachedMeshIndex: 0,
          certificationFramework: Frameworks.EDU_CPE,
        });

        // when
        const translatedLabel = globalMeshLevel.getDescriptionLabel(translate);

        // then
        expect(translatedLabel).to.equal(translate('certification.meshlevel.EDU_CPE.LEVEL_ADMISSIBLE.description'));
      });
    });
  });
});
