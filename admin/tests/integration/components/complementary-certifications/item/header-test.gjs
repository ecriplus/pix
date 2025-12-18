import { render, within } from '@1024pix/ember-testing-library';
import Header from 'pix-admin/components/complementary-certifications/item/header';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | complementary-certifications/item/header', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when hasComplementaryReferential is true', function () {
    test('it should display "Référentiel de certification" as title', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const complementaryCertification = store.createRecord('complementary-certification', {
        id: '0',
        key: 'DROIT',
        label: 'Pix+Droit',
        hasComplementaryReferential: true,
      });

      // when
      const screen = await render(
        <template><Header @complementaryCertification={{complementaryCertification}} /></template>,
      );

      // then
      const expectedTitle = `${t('components.complementary-certifications.item.certification-framework')} ${complementaryCertification.label}`;
      assert.ok(screen.getByRole('heading', { name: expectedTitle, level: 1 }));
      const nav = screen.getByRole('navigation');
      assert.ok(within(nav).getByRole('link', { name: t('components.layout.sidebar.certification-frameworks') }));
    });
  });

  module('when hasComplementaryReferential is false', function () {
    test('it should display "Profil cible" as title', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const complementaryCertification = store.createRecord('complementary-certification', {
        id: '0',
        key: 'CLEA',
        label: 'CléA Numérique',
        hasComplementaryReferential: false,
      });

      // when
      const screen = await render(
        <template><Header @complementaryCertification={{complementaryCertification}} /></template>,
      );

      // then
      const expectedTitle = `${t('components.complementary-certifications.item.target-profile')} ${complementaryCertification.label}`;
      assert.ok(screen.getByRole('heading', { name: expectedTitle, level: 1 }));
      const nav = screen.getByRole('navigation');
      assert.ok(within(nav).getByRole('link', { name: t('components.layout.sidebar.certification-frameworks') }));
    });
  });
});
