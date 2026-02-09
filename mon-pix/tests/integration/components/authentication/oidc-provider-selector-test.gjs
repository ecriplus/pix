import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import OidcProviderSelector from 'mon-pix/components/authentication/oidc-provider-selector';
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
      { id: '1', organizationName: 'ConnectEtMoi', isVisible: true },
      { id: '2', organizationName: 'StarConnect', isVisible: true },
    ];

    // when
    const screen = await render(<template><OidcProviderSelector @providers={{providers}} /></template>);

    await click(screen.getByRole('button', { name: t(I18N_KEYS.selectLabel) }));
    await screen.findByRole('listbox');

    // then
    assert.dom(screen.getByPlaceholderText(t(I18N_KEYS.searchLabel))).exists();
    assert.dom(screen.getByText('ConnectEtMoi')).isVisible();
  });

  test('it displays a sorted list of oidc providers', async function (assert) {
    // given
    const providers = [
      { id: '1', organizationName: 'Third', isVisible: true },
      { id: '2', organizationName: 'Second', isVisible: true },
      { id: '3', organizationName: 'First', isVisible: true },
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

  module('when user selects a provider', function () {
    test('it triggers the onProviderChange property', async function (assert) {
      // given
      const providers = [
        { id: '1', organizationName: 'ConnectEtMoi', isVisible: true },
        { id: '2', organizationName: 'StarConnect', isVisible: true },
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
      sinon.assert.calledWith(onProviderChangeStub, '1');
      assert.ok(true);
    });
  });
});
