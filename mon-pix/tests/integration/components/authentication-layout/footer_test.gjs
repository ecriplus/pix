import { render } from '@1024pix/ember-testing-library';
import Footer from 'mon-pix/components/authentication-layout/footer';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Authentication-layout | footer', function (hooks) {
  setupIntlRenderingTest(hooks);
  test('it displays a locale switcher when url has org extension', async function (assert) {
    //when
    const screen = await render(<template><Footer /></template>);

    //then

    assert.dom(screen.queryByRole('button', { name: 'Sélectionnez une langue' })).exists();
  });
  test('it displays no locale switcher when url has fr extension', async function (assert) {
    //given
    const domainService = this.owner.lookup('service:currentDomain');
    sinon.stub(domainService, 'getExtension').returns('fr');

    //when
    const screen = await render(<template><Footer /></template>);

    //then
    assert.dom(screen.queryByRole('button', { name: 'Sélectionnez une langue' })).doesNotExist();
  });
});
