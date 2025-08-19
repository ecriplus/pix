import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Certification Banners | Outdated Double Certification Banner', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('When the double certification badge is outdated', function () {
    test(`renders the outdated complementary certification`, async function (assert) {
      // given
      const outdatedDoubleCertification = {
        label: 'CléA Numérique',
        imageUrl: 'http://www.image-clea.com',
        isBadgeValid: false,
        validatedDoubleCertification: false,
      };

      this.set('outdatedDoubleCertification', outdatedDoubleCertification);
      this.set('closeBanner', () => {});

      // when
      const screen = await render(
        hbs`<CertificationBanners::OutdatedDoubleCertificationBanner @doubleCertification={{this.outdatedDoubleCertification}} />`,
      );

      // then
      assert.dom(screen.getByRole('img', { name: 'CléA Numérique' })).exists();
      assert
        .dom(screen.getByText("Vous n'êtes plus éligible à la certification CléA Numérique suite à son évolution."))
        .exists();
      assert
        .dom(
          screen.getByText(
            "Recontactez votre établissement ou l’organisation vous ayant proposé le parcours afin de repasser une campagne et ainsi redevenir éligible. Votre progression a été conservée et vous n'aurez qu'à jouer les nouvelles épreuves, cela devrait être rapide.",
          ),
        )
        .exists();
    });
  });
});
