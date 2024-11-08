import { render } from '@1024pix/ember-testing-library';
import ModulixNavbar from 'mon-pix/components/module/navbar';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Navbar', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display current step ', async function (assert) {
    //  when
    const screen = await render(<template><ModulixNavbar @currentStep="1" @totalSteps="2" /></template>);

    // then
    assert.ok(screen);
    assert.dom(screen.getByRole('navigation', { name: 'Étape 1 sur 2' })).exists();
  });
});
