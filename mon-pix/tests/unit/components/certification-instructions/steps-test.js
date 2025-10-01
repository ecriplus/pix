import { module, test } from 'qunit';
import sinon from 'sinon';

import createGlimmerComponent from '../../../helpers/create-glimmer-component';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Unit | Component | certification-instruction | steps', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('#nextStep', function () {
    module('when pageId is lower than pageCount', function () {
      test('should change the pageId', async function (assert) {
        // given
        const component = createGlimmerComponent('certification-instructions/steps');

        component.pageId = 1;
        component.pageCount = 2;
        component.isConfirmationCheckboxChecked = false;

        // when
        await component.nextStep();

        // then
        assert.strictEqual(component.pageId, 2);
      });
    });

    module('when pageId equal pageCount', function () {
      module('when confirmation checkbox is checked', function () {
        test('should redirect to certification starter', async function (assert) {
          // given
          const component = createGlimmerComponent('certification-instructions/steps');

          component.pageId = 2;
          component.pageCount = 2;
          component.isConfirmationCheckboxChecked = true;
          const transitionToStub = sinon.stub();
          const saveStub = sinon.stub();
          saveStub.resolves();
          component.router = {
            transitionTo: transitionToStub,
          };
          component.args.candidate = {
            save: saveStub,
            id: '123',
          };

          // when
          await component.nextStep();

          // then
          assert.ok(transitionToStub.calledWith('authenticated.certifications.start', '123'));
        });
      });
    });
  });

  module('#certificationName', function () {
    test('should return Pix when no complementary certification key', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: null,
        },
      });

      // then
      assert.strictEqual(component.certificationName, 'Pix');
    });

    test('should return complementary certification name when has key', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'DROIT',
        },
      });

      // then
      assert.strictEqual(component.certificationName, 'Pix+ Droit');
    });

    test('should return Pix when has CLEA key', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'CLEA',
        },
      });

      // then
      assert.strictEqual(component.certificationName, 'Pix');
    });
  });

  module('#title', function () {
    test('should use Pix when CLEA complementary certification key', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'CLEA',
        },
      });
      component.pageId = 1;

      // then
      assert.strictEqual(component.title, 'Bienvenue à la certification Pix');
    });
  });

  module('#certificationInstructionStep1Paragraph1', function () {
    test('should return default text when no complementary certification key', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: null,
        },
      });

      // then
      assert.ok(
        component.certificationInstructionStep1Paragraph1
          .toString()
          .includes('ensemble des 16 compétences numériques du référentiel Pix'),
      );
    });

    test('should return default text when CLEA complementary certification key', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'CLEA',
        },
      });

      // then
      assert.ok(
        component.certificationInstructionStep1Paragraph1
          .toString()
          .includes('ensemble des 16 compétences numériques du référentiel Pix'),
      );
    });

    test('should return Pix+ specific text when has complementary certification key', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'DROIT',
        },
      });

      // then
      assert.ok(
        component.certificationInstructionStep1Paragraph1
          .toString()
          .includes('ensemble des compétences du référentiel de certification Pix+ Droit'),
      );
    });
  });

  module('#certificationDurationInMinutes', function () {
    test('should return 105 minutes for standard Pix certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: null,
        },
      });

      // then
      assert.strictEqual(component.certificationDurationInMinutes, 105);
    });

    test('should return 105 minutes for CLEA certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'CLEA',
        },
      });

      // then
      assert.strictEqual(component.certificationDurationInMinutes, 105);
    });

    test('should return 45 minutes for Pix+ Droit certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'DROIT',
        },
      });

      // then
      assert.strictEqual(component.certificationDurationInMinutes, 45);
    });

    test('should return 45 minutes for Pix+ Pro Santé certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'PRO_SANTE',
        },
      });

      // then
      assert.strictEqual(component.certificationDurationInMinutes, 45);
    });

    test('should return 90 minutes for Pix+ Édu 1er degré certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'EDU_1ER_DEGRE',
        },
      });

      // then
      assert.strictEqual(component.certificationDurationInMinutes, 90);
    });

    test('should return 90 minutes for Pix+ Édu 2nd degré certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'EDU_2ND_DEGRE',
        },
      });

      // then
      assert.strictEqual(component.certificationDurationInMinutes, 90);
    });

    test('should return 90 minutes for Pix+ Édu CPE certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'EDU_CPE',
        },
      });

      // then
      assert.strictEqual(component.certificationDurationInMinutes, 90);
    });
  });

  module('#durationLegend', function () {
    test('should return "1 H 45 min" for standard Pix certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: null,
        },
      });

      // then
      assert.strictEqual(component.durationLegend, '1 H 45 min');
    });

    test('should return "45 min" for Pix+ Droit certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'DROIT',
        },
      });

      // then
      assert.strictEqual(component.durationLegend, '45 min');
    });

    test('should return "1 H 30 min" for Pix+ Édu certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'EDU_1ER_DEGRE',
        },
      });

      // then
      assert.strictEqual(component.durationLegend, '1 H 30 min');
    });
  });

  module('#durationText', function () {
    test('should return "1h45" for standard Pix certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: null,
        },
      });

      // then
      assert.strictEqual(component.durationText, '1h45');
    });

    test('should return "45min" for Pix+ Droit certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'DROIT',
        },
      });

      // then
      assert.strictEqual(component.durationText, '45min');
    });

    test('should return "1h30" for Pix+ Édu certification', function (assert) {
      // given
      const component = createGlimmerComponent('certification-instructions/steps', {
        candidate: {
          complementaryCertificationKey: 'EDU_2ND_DEGRE',
        },
      });

      // then
      assert.strictEqual(component.durationText, '1h30');
    });
  });
});
