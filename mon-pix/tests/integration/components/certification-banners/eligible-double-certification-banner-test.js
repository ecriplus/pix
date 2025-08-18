import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Certification Banners | Eligible Double Certification Banner', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('When there is a double eligible complementary certification', function () {
    test(`renders the complementary certification eligibility special message and picture`, async function (assert) {
      // given
      const doubleCertification = {
        label: 'CléA Numérique',
        imageUrl: 'http://www.image-clea.com',
        isBadgeValid: true,
        validatedDoubleCertification: false,
      };
      this.set('doubleCertification', doubleCertification);

      // when
      const screen = await render(
        hbs`<CertificationBanners::EligibleDoubleCertificationBanner @doubleCertification={{this.doubleCertification}} />`,
      );

      // then
      assert.ok(screen.getByText('Vous êtes également éligible à la certification complémentaire :'));
      assert.ok(screen.getByText('CléA Numérique'));
      assert.ok(screen.getByRole('img', { name: 'CléA Numérique' }));
    });
  });
});
