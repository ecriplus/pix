import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { stubCurrentUserService } from '../../../../helpers/service-stubs';
import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Certifications | Certificate information | download pdf', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display verification code information', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const certification = store.createRecord('certification', {
      birthdate: '2000-01-22',
      birthplace: 'Paris',
      firstName: 'Jean',
      lastName: 'Bon',
      certificationDate: new Date('2018-02-15T15:15:52Z'),
      deliveredAt: new Date('2018-02-17T15:15:52Z'),
      certificationCenter: 'Université de Lyon',
      pixScore: 12,
      maxReachableLevelOnCertificationDate: new Date('2018-02-15T15:15:52Z'),
      verificationCode: 'P-1871389473',
    });
    this.set('certification', certification);

    // when
    const screen = await render(
      hbs`<Certifications::CertificateInformation::downloadPdf @certificate={{this.certification}} />`,
    );

    // then
    assert.dom(screen.getByRole('button', { name: t('pages.certificate.actions.download') })).exists();
    assert.dom(screen.getByRole('button', { name: t('pages.certificate.verification-code.copy') })).exists();
    assert
      .dom(screen.getByRole('heading', { name: t('pages.certificate.verification-code.share'), level: 2 }))
      .exists();
    assert.dom(screen.getByText(certification.verificationCode)).exists();
  });

  module('when there is an error during the download of the attestation', function () {
    test('should show the common error message', async function (assert) {
      // given
      stubCurrentUserService(this.owner);
      const fileSaverSaveStub = sinon.stub();

      class FileSaverStub extends Service {
        save = fileSaverSaveStub;
      }

      this.owner.register('service:fileSaver', FileSaverStub);

      fileSaverSaveStub.rejects(new Error('an error message'));

      const store = this.owner.lookup('service:store');
      const certification = store.createRecord('certification', {
        birthdate: '2000-01-22',
        birthplace: 'Paris',
        firstName: 'Jean',
        lastName: 'Bon',
        certificationDate: new Date('2018-02-15T15:15:52Z'),
        deliveredAt: new Date('2018-02-17T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        pixScore: 12,
        maxReachableLevelOnCertificationDate: new Date('2018-02-15T15:15:52Z'),
      });
      this.set('certification', certification);

      const screen = await render(
        hbs`<Certifications::CertificateInformation::downloadPdf @certificate={{this.certification}} />`,
      );

      // when
      await click(screen.getByRole('button', { name: t('pages.certificate.actions.download') }));

      // then
      assert.ok(screen.getByText(t('common.error')));
    });
  });
});
