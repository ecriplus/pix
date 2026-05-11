import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Certifications | Shareable certificate | v3-pix-plus-certificate', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('for all pix-plus v3', function () {
    test('it displays results information', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const certification = store.createRecord('certification', {
        birthdate: '2000-01-22',
        birthplace: 'Paris',
        firstName: 'Jean',
        lastName: 'Doe',
        certificationDate: new Date('2026-02-15T10:00:00Z'),
        deliveredAt: new Date('2026-02-20T10:00:00Z'),
        certificationCenter: 'Université de Lyon',
        certificationFramework: 'EDU_1ER_DEGRE',
        level: 'ADMISSIBLE',
      });
      this.set('certification', certification);

      // when
      const screen = await render(hbs`
          <Certifications::ShareableCertificate::V3PixPlusCertificate @certificate={{this.certification}} />`);

      // then
      assert.dom(screen.getAllByText(t('pages.certificate.valid-status'))[0]).exists();
      assert.dom(screen.getByText(`${t('pages.certificate.candidate')} Jean Doe`)).exists();
      assert.dom(screen.getByText('Université de Lyon')).exists();
      assert.dom(screen.getByText('15/02/2026')).exists();
      assert.dom(screen.getByText('20/02/2026')).exists();
      assert.dom('.certification-result-hexagon').exists();
    });
  });

  module('for an EDU framework', function () {
    test('it displays the stepper', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const certification = store.createRecord('certification', {
        birthdate: '2000-01-22',
        birthplace: 'Paris',
        firstName: 'Jean',
        lastName: 'Doe',
        certificationDate: new Date('2026-02-15T10:00:00Z'),
        deliveredAt: new Date('2026-02-20T10:00:00Z'),
        certificationCenter: 'Université de Lyon',
        certificationFramework: 'EDU_1ER_DEGRE',
      });
      this.set('certification', certification);

      // when
      const screen = await render(hbs`
          <Certifications::ShareableCertificate::V3PixPlusCertificate @certificate={{this.certification}} />`);

      // then
      assert.dom(screen.getByText(t('pages.certificate.frameworks.EDU.steps.1'))).exists();
    });

    test('it displays the results block', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const certification = store.createRecord('certification', {
        birthdate: '2000-01-22',
        birthplace: 'Paris',
        firstName: 'Jean',
        lastName: 'Doe',
        certificationDate: new Date('2026-02-15T10:00:00Z'),
        deliveredAt: new Date('2026-02-20T10:00:00Z'),
        certificationCenter: 'Université de Lyon',
        certificationFramework: 'EDU_1ER_DEGRE',
      });
      this.set('certification', certification);

      // when
      const screen = await render(hbs`
          <Certifications::ShareableCertificate::V3PixPlusCertificate @certificate={{this.certification}} />`);

      // then
      assert.dom(screen.getByRole('heading', { level: 3, name: t('pages.certificate.results.title') })).exists();
    });

    test('it displays the EDU certification sub-title', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const certification = store.createRecord('certification', {
        birthdate: '2000-01-22',
        birthplace: 'Paris',
        firstName: 'Jean',
        lastName: 'Doe',
        certificationDate: new Date('2026-02-15T10:00:00Z'),
        deliveredAt: new Date('2026-02-20T10:00:00Z'),
        certificationCenter: 'Université de Lyon',
        certificationFramework: 'EDU_1ER_DEGRE',
      });
      this.set('certification', certification);

      // when
      const screen = await render(hbs`
          <Certifications::ShareableCertificate::V3PixPlusCertificate @certificate={{this.certification}} />`);

      // then
      const subTitle = t('pages.certificate.frameworks.EDU.sub-title').replace(/ /g, ' ');
      assert
        .dom(screen.getByRole('heading', { level: 2, name: (name) => name.replace(/ /g, ' ').includes(subTitle) }))
        .exists();
    });

    module('level tag', function () {
      test('it displays the level tag when the level is ADMISSIBLE', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const certification = store.createRecord('certification', {
          birthdate: '2000-01-22',
          birthplace: 'Paris',
          firstName: 'Jean',
          lastName: 'Doe',
          certificationDate: new Date('2026-02-15T10:00:00Z'),
          deliveredAt: new Date('2026-02-20T10:00:00Z'),
          certificationCenter: 'Université de Lyon',
          certificationFramework: 'EDU_1ER_DEGRE',
          level: 'ADMISSIBLE',
        });
        this.set('certification', certification);

        // when
        const screen = await render(hbs`
            <Certifications::ShareableCertificate::V3PixPlusCertificate @certificate={{this.certification}} />`);

        // then
        assert.dom(screen.getByText(t('pages.user-certifications.meshes.EDU_1ER_DEGRE.ADMISSIBLE'))).exists();
      });

      test('it does not display the level tag when the level is not ADMISSIBLE', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const certification = store.createRecord('certification', {
          birthdate: '2000-01-22',
          birthplace: 'Paris',
          firstName: 'Jean',
          lastName: 'Doe',
          certificationDate: new Date('2026-02-15T10:00:00Z'),
          deliveredAt: new Date('2026-02-20T10:00:00Z'),
          certificationCenter: 'Université de Lyon',
          certificationFramework: 'EDU_1ER_DEGRE',
          level: 'EXPERT',
        });
        this.set('certification', certification);

        // when
        const screen = await render(hbs`
            <Certifications::ShareableCertificate::V3PixPlusCertificate @certificate={{this.certification}} />`);

        // then
        assert.dom(screen.queryByText(t('pages.user-certifications.meshes.EDU_1ER_DEGRE.EXPERT'))).doesNotExist();
      });
    });
  });

  module('for a non-EDU framework', function () {
    test('it does not display EDU-specific elements', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const certification = store.createRecord('certification', {
        birthdate: '2000-01-22',
        birthplace: 'Paris',
        firstName: 'Jean',
        lastName: 'Doe',
        certificationDate: new Date('2026-02-15T10:00:00Z'),
        deliveredAt: new Date('2026-02-20T10:00:00Z'),
        certificationCenter: 'Université de Lyon',
        certificationFramework: 'DROIT',
        level: 'EXPERT',
      });
      this.set('certification', certification);

      // when
      const screen = await render(hbs`
          <Certifications::ShareableCertificate::V3PixPlusCertificate @certificate={{this.certification}} />`);

      // then
      assert.dom(screen.queryByText(t('pages.certificate.frameworks.EDU.steps.1'))).doesNotExist();
      assert
        .dom(screen.queryByRole('heading', { level: 3, name: t('pages.certificate.results.title') }))
        .doesNotExist();
      assert.dom(screen.queryByText(t('pages.user-certifications.meshes.DROIT.EXPERT'))).doesNotExist();
    });

    test('it displays the obtained certification sub-title', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const certification = store.createRecord('certification', {
        birthdate: '2000-01-22',
        birthplace: 'Paris',
        firstName: 'Jean',
        lastName: 'Doe',
        certificationDate: new Date('2026-02-15T10:00:00Z'),
        deliveredAt: new Date('2026-02-20T10:00:00Z'),
        certificationCenter: 'Université de Lyon',
        certificationFramework: 'DROIT',
      });
      this.set('certification', certification);

      // when
      const screen = await render(hbs`
          <Certifications::ShareableCertificate::V3PixPlusCertificate @certificate={{this.certification}} />`);

      // then
      assert
        .dom(
          screen.getByText(
            t('pages.certificate.obtained-certification', {
              frameworkLabel: t('pages.certification-frameworks.DROIT'),
            }),
          ),
        )
        .exists();
    });
  });
});
