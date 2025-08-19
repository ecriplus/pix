import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Certification Banners | Congratulations Certification Banner', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('renders a banner indicating the user certifiability', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    this.set('fullName', 'Fifi Brindacier');
    this.set('certificationEligibility', store.createRecord('is-certifiable', {}));

    // when
    const screen = await render(
      hbs`<CertificationBanners::CongratulationsCertificationBanner
  @fullName={{this.fullName}}
  @certificationEligibility={{this.certificationEligibility}}
/>`,
    );

    // then
    assert.ok(screen.getByText('Bravo Fifi Brindacier, votre profil Pix est certifiable.'));
  });

  module('when there is no double certification eligibility', function () {
    test('should not display double certification information', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      this.set('fullName', 'Fifi Brindacier');
      this.set('certificationEligibility', store.createRecord('is-certifiable', { 'is-certifiable': true }));

      // when
      const screen = await render(
        hbs`<CertificationBanners::CongratulationsCertificationBanner
  @fullName={{this.fullName}}
  @certificationEligibility={{this.certificationEligibility}}
/>`,
      );

      // then
      assert.notOk(screen.queryByText('Vous êtes également éligible à la certification complémentaire :'));
    });
  });
});
