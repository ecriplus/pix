import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import OidcProviderSelector from 'pix-orga/components/authentication/oidc-provider-selector';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

const I18N_KEYS = {
  selectLabel: 'components.authentication.oidc-provider-selector.label',
  selectPlaceholder: 'components.authentication.oidc-provider-selector.placeholder',
  searchLabel: 'components.authentication.oidc-provider-selector.searchLabel',
};

module('Integration | Component | Authentication | oidc-provider-selector', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it displays an Oidc Provider selector with correct labels', async function (assert) {
    // given
    const providers = [
      { id: 'connect-et-moi', slug: 'connect-et-moi', organizationName: 'ConnectEtMoi', isVisible: true },
      { id: 'star-connect', slug: 'star-connect', organizationName: 'StarConnect', isVisible: true },
    ];

    // when
    const screen = await render(<template><OidcProviderSelector @providers={{providers}} /></template>);
    await click(screen.getByRole('button', { name: t(I18N_KEYS.selectLabel) }));
    await screen.findByRole('listbox');

    // then
    assert.dom(screen.getAllByText(t(I18N_KEYS.selectPlaceholder))[0]).exists();
    assert.dom(screen.getByText(t(I18N_KEYS.searchLabel))).exists();
    assert.dom(screen.getByText('ConnectEtMoi')).isVisible();
  });

  test('it displays a sorted list of oidc providers', async function (assert) {
    // given
    const providers = [
      { id: 'third', slug: 'third', organizationName: 'Third', isVisible: true },
      { id: 'second', slug: 'second', organizationName: 'Second', isVisible: true },
      { id: 'first', slug: 'first', organizationName: 'First', isVisible: true },
    ];

    // when
    const screen = await render(<template><OidcProviderSelector @providers={{providers}} /></template>);
    await click(screen.getByRole('button', { name: t(I18N_KEYS.selectLabel) }));
    await screen.findByRole('listbox');

    // then
    const options = await screen.findAllByRole('option');
    const optionsLabels = options.map((option) => option.innerText);

    assert.deepEqual(optionsLabels, ['First', 'Second', 'Third']);
  });

  test('it displays only visible oidc providers', async function (assert) {
    // given
    const providers = [
      { id: 'third', slug: 'third', organizationName: 'Third', isVisible: true },
      { id: 'second', slug: 'second', organizationName: 'Second', isVisible: true },
      { id: 'first', slug: 'first', organizationName: 'First', isVisible: false },
    ];

    // when
    const screen = await render(<template><OidcProviderSelector @providers={{providers}} /></template>);
    await click(screen.getByRole('button', { name: t(I18N_KEYS.selectLabel) }));
    await screen.findByRole('listbox');

    // then
    assert.dom(screen.getByText('Third')).exists();
    assert.dom(screen.getByText('Second')).exists();
    assert.dom(screen.queryByText('First')).doesNotExist();
  });

  module('when user selects a provider', function () {
    test('it triggers the onProviderChange property', async function (assert) {
      // given
      const providers = [
        { id: 'connect-et-moi', slug: 'connect-et-moi', organizationName: 'ConnectEtMoi', isVisible: true },
        { id: 'star-connect', slug: 'star-connect', organizationName: 'StarConnect', isVisible: true },
      ];

      const onProviderChangeStub = sinon.stub();

      // when
      const screen = await render(
        <template>
          <OidcProviderSelector @providers={{providers}} @onProviderChange={{onProviderChangeStub}} />
        </template>,
      );
      await click(screen.getByRole('button', { name: t(I18N_KEYS.selectLabel) }));
      await screen.findByRole('listbox');

      await click(screen.getByRole('option', { name: 'ConnectEtMoi' }));

      // then
      assert.ok(onProviderChangeStub.calledWith('connect-et-moi'));
    });
  });
});
