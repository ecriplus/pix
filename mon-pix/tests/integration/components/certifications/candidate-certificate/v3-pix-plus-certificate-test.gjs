import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Certifications | Candidate certificate | v3-pix-plus-certificate', function (hooks) {
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
      });
      this.set('certification', certification);

      // when
      const screen = await render(hbs`
          <Certifications::CandidateCertificate::v3PixPlusCertificate @certificate={{this.certification}} />`);

      // then
      assert.dom(screen.getAllByText(t('pages.certificate.frameworks.EDU.status'))[0]).exists();
      assert.dom(screen.getByText(`${t('pages.certificate.candidate')} Jean Doe`)).exists();
      assert.dom(screen.getByText('Université de Lyon')).exists();
      assert.dom(screen.getByText('15/02/2026')).exists();
      assert.dom(screen.getByText('20/02/2026')).exists();
      assert.dom(screen.getByText(t('pages.user-certifications.meshes.EDU_1ER_DEGRE.0'))).exists();
      assert.dom(screen.getByRole('heading', { level: 3, name: t('pages.certificate.results.title') })).exists();
      assert.dom('.v3-pix-plus-certificate-score__hexagon').exists();
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
          <Certifications::CandidateCertificate::v3PixPlusCertificate @certificate={{this.certification}} />`);

      // then
      assert.dom(screen.getByText(t('pages.certificate.frameworks.EDU.steps.1'))).exists();
    });
  });

  module('for a non-EDU framework', function () {
    test('it does not display the stepper ', async function (assert) {
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
        certificationFramework: 'PRO_SANTE',
      });
      this.set('certification', certification);

      // when
      const screen = await render(hbs`
          <Certifications::CandidateCertificate::v3PixPlusCertificate @certificate={{this.certification}} />`);

      // then
      assert.dom(screen.queryByText(t('pages.certificate.frameworks.EDU.steps.1'))).doesNotExist();
    });
  });
});
