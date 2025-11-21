import { clickByName, fillByLabel, render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import CertificationsSearchForm from 'pix-admin/components/certifications/search-form';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | certifications/search-form', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it redirects to the certification page on submit', async function (assert) {
    // given
    const transitionTo = sinon.stub();
    class RouterStub extends Service {
      transitionTo = transitionTo;
    }
    this.owner.register('service:router', RouterStub);
    const screen = await render(<template><CertificationsSearchForm /></template>);
    const certificationId = '   super-certif    ';

    // when
    await fillByLabel('Trouver une certification', certificationId);
    await clickByName('Charger');

    // then
    assert.ok(transitionTo.calledWith('authenticated.sessions.certification', 'super-certif'));
    assert.dom(screen.getByRole('textbox')).hasValue(certificationId);
  });
});
